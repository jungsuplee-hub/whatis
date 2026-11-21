import {useEffect} from 'react'
import type {TrainingLesson} from './TrainingCurriculum'
import {findTrainingAction} from './training-highlight-map'

/**
 * Point to the actual element a learner must operate.
 * The guide never blocks pointer/keyboard actions; the halo and label are
 * pointer-events:none, and the original Teamcenter/Polarion UI keeps working.
 */
export function TrainingSpotlight({step,brand,paused}:{step:TrainingLesson<string>|null;brand:'polarion'|'teamcenter';paused:boolean}){
  useEffect(()=>{
    if(!step||paused)return
    const root=document.querySelector(brand==='polarion'?'.pl-demo-root':'.tcg-page')
    if(!root)return
    let selected:HTMLElement|SVGElement|null=null
    let raf=0
    let disposed=false
    const label=document.createElement('div')
    label.className='training-focus-indicator'
    label.setAttribute('aria-hidden','true')
    label.textContent='➜ '+step.title
    document.body.appendChild(label)

    const clean=()=>{
      if(!selected)return
      selected.classList.remove('training-focus-target')
      selected.removeAttribute('data-training-focus')
      selected=null
    }
    const place=()=>{
      if(disposed)return
      raf=0
      const next=findTrainingAction(step,brand)
      const changed=next!==selected
      if(changed){
        clean()
        selected=next
        if(selected){
          selected.classList.add('training-focus-target')
          selected.setAttribute('data-training-focus','true')
          const rect=selected.getBoundingClientRect()
          const inView=rect.top>75&&rect.bottom<window.innerHeight-32
          if(!inView){
            const motion=window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'
            selected.scrollIntoView({behavior:motion as ScrollBehavior,block:'center',inline:'nearest'})
          }
        }
      }
      if(!selected){
        label.style.display='none'
        return
      }
      const box=selected.getBoundingClientRect()
      if(box.bottom<0||box.top>window.innerHeight||box.right<0||box.left>window.innerWidth){
        label.style.display='none'
        return
      }
      label.style.display='block'
      const width=Math.min(window.innerWidth-12,240)
      const left=Math.max(6,Math.min(box.left,window.innerWidth-width-6))
      const top=box.top>58?box.top-51:Math.min(box.bottom+9,window.innerHeight-48)
      label.style.left=left+'px'
      label.style.top=top+'px'
    }
    const schedule=()=>{
      if(disposed||raf)return
      raf=window.requestAnimationFrame(place)
    }
    const observer=new MutationObserver(schedule)
    observer.observe(root,{subtree:true,childList:true})
    window.addEventListener('scroll',schedule,true)
    window.addEventListener('resize',schedule)
    window.addEventListener('input',schedule,true)
    window.addEventListener('change',schedule,true)
    window.addEventListener('click',schedule,true)
    schedule()
    return ()=>{
      disposed=true
      window.cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('scroll',schedule,true)
      window.removeEventListener('resize',schedule)
      window.removeEventListener('input',schedule,true)
      window.removeEventListener('change',schedule,true)
      window.removeEventListener('click',schedule,true)
      clean()
      label.remove()
    }
  },[step?.id,brand,paused])
  return null
}
