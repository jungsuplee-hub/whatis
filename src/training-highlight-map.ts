import type {TrainingLesson} from './TrainingCurriculum'

/** Ordered selectors for the real controls used in each hands-on exercise.
 *  More specific/multi-stage controls come first, with a visible parent action
 *  as a fallback when a dialog has not been opened yet.
 */
const pl:Record<number,string[]> = {
  1:['.pl-brand','.pl-topics button[title="프로젝트 홈"]'],
  2:['.pl-topics button[title="요구사항·결함·테스트"]'],
  3:['.pl-list-search input'],
  4:['.pl-list-search select[aria-label="종류 필터"]'],
  5:['.pl-list-search select[aria-label="상태 필터"]'],
  6:['.pl-list-topbar button[title="필터 초기화"]'],
  7:['.pl-view-select button:nth-child(2)'],
  8:['.pl-tree-toggle','.pl-view-select button:nth-child(2)'],
  9:['.pl-view-select button:first-child'],
  10:['.pl-modal footer .pl-primary:not(:disabled)','.pl-modal input[placeholder="Enter Work Item title"]','.pl-modal select','.pl-page-heading .pl-primary'],
  11:['.pl-work-list .pl-table tbody tr:first-child'],
  12:['.pl-commandbar button:first-child','.pl-item-details .pl-edit-fields input','.pl-work-detail'],
  13:['.pl-status-quick select'],
  14:['.pl-commandbar button:has(svg.lucide-check)','.pl-commandbar button:nth-child(3)'],
  15:['.pl-item-details .pl-comment-input input','.pl-item-details .pl-comment-input button'],
  16:['.pl-item-tabs button:nth-child(2)'],
  17:['.pl-activity-panel .pl-comment-input input','.pl-activity-panel .pl-comment-input button','.pl-item-tabs button:nth-child(2)'],
  18:['.pl-item-tabs button:first-child'],
  19:['.pl-modal footer .pl-primary:not(:disabled)','.pl-modal input[placeholder="Enter Work Item title"]','.pl-modal select','.pl-page-heading .pl-primary'],
  20:['.pl-modal footer .pl-primary:not(:disabled)','.pl-modal input[placeholder="Enter Work Item title"]','.pl-modal select','.pl-page-heading .pl-primary'],
  21:['.pl-modal footer .pl-primary:not(:disabled)','.pl-modal input[placeholder="Enter Work Item title"]','.pl-modal select','.pl-page-heading .pl-primary'],
  22:['.pl-modal footer .pl-primary:not(:disabled)','.pl-modal input[placeholder="Enter Work Item title"]','.pl-modal select','.pl-page-heading .pl-primary'],
  23:['.pl-work-list .pl-table tbody tr:first-child'],
  24:['.pl-inline-form .pl-primary:not(:disabled)','.pl-inline-form select','.pl-item-details .pl-section-heading button'],
  25:['.pl-linked-row button'],
  26:['.pl-trace-links button:first-child'],
  27:['.pl-work-list .pl-table tbody tr:first-child'],
  28:['.pl-commandbar button:has(svg.lucide-shield-check)','.pl-review-buttons button'],
  29:['.pl-commandbar button:has(svg.lucide-check-circle-2)','.pl-review-buttons .pl-primary','.pl-commandbar button:has(svg.lucide-shield-check)'],
  30:['.pl-item-tabs button:nth-child(2)'],
  31:['.pl-commandbar button:has(svg.lucide-shield-check)','.pl-review-buttons .pl-primary'],
  32:['.pl-review-buttons button:nth-child(2)','.pl-commandbar button:has(svg.lucide-refresh-cw)','.pl-commandbar button:has(svg.lucide-shield-check)'],
  33:['.pl-creation-bar .pl-primary:not(:disabled)','.pl-creation-bar input','.pl-page-heading .pl-primary'],
  34:['.pl-doc-tree button:last-child'],
  35:['.pl-doc-properties .pl-command-actions .pl-primary','.pl-doc-properties textarea','.pl-doc-properties .pl-secondary.pl-full','.pl-document-toolbar button:has(svg.lucide-pencil)'],
  36:['.pl-doc-attach button','.pl-document-toolbar button:has(svg.lucide-plus)'],
  37:['.pl-document-toolbar button:has(svg.lucide-shield-check)','.pl-doc-tree button[data-doc-status="Draft"]','.pl-page-heading .pl-primary'],
  38:['.pl-document-toolbar button:has(svg.lucide-check-circle-2)','.pl-document-toolbar button:first-child','.pl-doc-tree button'],
  39:['.pl-creation-bar .pl-primary:not(:disabled)','.pl-creation-bar input','.pl-page-heading .pl-primary'],
  40:['.pl-entity-list button:last-child'],
  41:['.pl-inline-form .pl-primary:not(:disabled)','.pl-inline-form select'],
  42:['.pl-section-heading button'],
  43:['.pl-plan-item button'],
  44:['.pl-creation-bar .pl-primary:not(:disabled)','.pl-creation-bar input','.pl-page-heading .pl-primary'],
  45:['.pl-entity-list button:last-child'],
  46:['.pl-inline-form .pl-secondary:not(:disabled)','.pl-inline-form select'],
  47:['.pl-test-case-button'],
  48:['.pl-test-actions .pl-secondary','.pl-test-evidence textarea'],
  49:['.pl-test-table select'],
  50:['.pl-run-summary button'],
  51:['.pl-test-table select'],
  52:['.pl-test-actions .pl-primary','.pl-test-table select'],
  53:['.pl-work-list .pl-table tbody tr:first-child'],
  54:['.pl-creation-bar .pl-primary:not(:disabled)','.pl-creation-bar input'],
  55:['.pl-entity-list button:last-child','.pl-creation-bar input'],
  56:['.pl-entity-body .pl-primary','.pl-entity-list button:last-child','.pl-creation-bar input'],
  57:['.pl-page-heading .pl-primary'],
  58:['.pl-report-filter select']
}

const tc:Record<number,string[]> = {
  1:['.tcg-mark','.tcg-sidebar button[title="대시보드"]'],
  2:['.tcg-launcher-toggle','.tcg-aw-actions header button'],
  3:['.tcg-session-trigger'],
  4:['.tcg-user-popover label:nth-of-type(1) select','.tcg-session-trigger'],
  5:['.tcg-user-popover label:nth-of-type(2) select','.tcg-session-trigger'],
  6:['.tcg-user-popover label:nth-of-type(3) select','.tcg-session-trigger'],
  7:['.tcg-appbar-tools button[title="알림"]'],
  8:['.tcg-global-search-field input','.tcg-search-line input'],
  9:['.tcg-aw-facet-group:nth-of-type(1) button:nth-child(3)','.tcg-global-search select','.tcg-aw-results-bar button:first-child'],
  10:['.tcg-aw-facet-group:nth-of-type(2) button:nth-child(3)','.tcg-aw-results-bar button:first-child'],
  11:['.tcg-aw-facets header button','.tcg-aw-results-bar button:last-child','.tcg-aw-results-bar button:first-child'],
  12:['.tcg-aw-results .tcg-record-table tbody tr:first-child'],
  13:['.tcg-aw-preview-tabs button:nth-child(2)'],
  14:['.tcg-folders button:nth-last-child(2)','.tcg-folders button'],
  15:['.tcg-create-panel > .tcg-primary:not(:disabled)','.tcg-create-panel input[placeholder="이름 입력"]','.tcg-toolbar .tcg-primary'],
  16:['.tcg-explorer-grid .tcg-inspector-command.primary','.tcg-explorer-grid .tcg-form input','.tcg-explorer-grid .tcg-inspector-command[title="속성 편집 시작"]'],
  17:['.tcg-explorer-grid .tcg-inspector-command[title="새 리비전 생성"]'],
  18:['.tcg-create-panel > .tcg-primary:not(:disabled)','.tcg-create-panel input[placeholder="이름 입력"]','.tcg-create-panel select','.tcg-toolbar .tcg-primary'],
  19:['.tcg-explorer-grid .tcg-object-history summary'],
  20:['.tcg-bom .tcg-bom-object button:first-child'],
  21:['.tcg-bom .tcg-bom-row:nth-of-type(3)','.tcg-bom .tcg-bom-row:nth-of-type(2)'],
  22:['.tcg-bom .tcg-bom-row .tcg-qty button:not(:disabled)'],
  23:['.tcg-bom-grid .tcg-side-panel button.tcg-full'],
  24:['.tcg-inline .tcg-primary','.tcg-inline select','.tcg-toolbar .tcg-primary'],
  25:['.tcg-toolbar .tcg-secondary'],
  26:['.tcg-workmode-tabs button:nth-child(2)'],
  27:['.tcg-workmode-tabs button:nth-child(3)'],
  28:['.tcg-workmode-tabs button:nth-child(4)'],
  29:['.tcg-doc-list .tcg-doc-row:nth-of-type(2)','.tcg-doc-list .tcg-doc-row'],
  30:['.tcg-file-form input','.tcg-file-form button'],
  31:['.tcg-doc-detail .tcg-file button'],
  32:['.tcg-document-commandbar button'],
  33:['.tcg-workflow-dialog label:nth-of-type(1) select','.tcg-workflow-dialog select','.tcg-document-commandbar button'],
  34:['.tcg-workflow-dialog label:nth-of-type(2) select','.tcg-workflow-dialog select','.tcg-document-commandbar button'],
  35:['.tcg-workflow-dialog footer .tcg-primary','.tcg-document-commandbar button'],
  36:['.tcg-sidebar button[title="승인과 검토"]','.tcg-aw-tasks header button'],
  37:['.tcg-task-list .tcg-task-row:first-of-type','.tcg-task-list .tcg-task-row'],
  38:['.tcg-content-columns .tcg-side-panel textarea'],
  39:['.tcg-content-columns .tcg-actions .tcg-primary'],
  40:['.tcg-content-columns .tcg-actions .tcg-danger','.tcg-task-list .tcg-task-row:nth-of-type(2)'],
  41:['.tcg-change-new .tcg-primary:not(:disabled)','.tcg-change-new input','.tcg-change-create-bar .tcg-primary'],
  42:['.tcg-change-row:last-of-type','.tcg-change-row'],
  43:['.tcg-content-columns .tcg-file-form button','.tcg-content-columns .tcg-file-form select'],
  44:['.tcg-affected button:not(:disabled)'],
  45:['.tcg-content-columns .tcg-side-panel .tcg-primary.tcg-full'],
  46:['.tcg-content-columns .tcg-side-panel .tcg-primary.tcg-full'],
  47:['.tcg-viewer-part','.tcg-svg-select'],
  48:['.tcg-viewer-control button:first-child'],
  49:['.tcg-viewer-control input[type="range"]'],
  50:['.tcg-viewer-control button:last-child'],
  51:['.tcg-guide-verify button'],
  52:['.tcg-mark']
}


function guidedFormTarget(step:TrainingLesson<string>,container:Element,brand:'polarion'|'teamcenter'):Element|null{
  const q=(selector:string)=>container.querySelector(selector)
  const typed=(selector:string)=>q(selector) as HTMLInputElement|HTMLTextAreaElement|null
  const actionable=(selector:string)=>q(selector) as HTMLButtonElement|null
  // The form type matters: "Create Test Case" must point to Test Case first,
  // not accidentally encourage creating a Requirement instead.
  if(step.id.startsWith('pl-') && ['pl-10','pl-19','pl-20','pl-21','pl-22'].includes(step.id)){
    const form=q('.pl-modal')
    if(form){
      const expected:Record<string,string>={'pl-10':'Requirement','pl-19':'Test Case','pl-20':'Defect','pl-21':'Task','pl-22':'Change Request'}
      const type=q('.pl-modal select') as HTMLSelectElement|null
      if(type && type.value!==expected[step.id])return type
      const title=typed('.pl-modal input[placeholder="Enter Work Item title"]')
      if(title&&!title.value.trim())return title
      return actionable('.pl-modal footer .pl-primary:not(:disabled)')||title
    }
  }
  if(brand==='teamcenter' && (step.id==='tc-15'||step.id==='tc-18')){
    const form=q('.tcg-create-panel')
    if(form){
      const kind=q('.tcg-create-panel select') as HTMLSelectElement|null
      const expected=step.id==='tc-18'?'Document':'Item'
      if(kind&&kind.value!==expected)return kind
      const title=typed('.tcg-create-panel input[placeholder="이름 입력"]')
      if(title&&!title.value.trim())return title
      return actionable('.tcg-create-panel > .tcg-primary:not(:disabled)')||title
    }
  }
  if(step.id==='tc-41' && q('.tcg-change-new')){
    const name=typed('.tcg-change-new input')
    if(name&&!name.value.trim())return name
    const reason=typed('.tcg-change-new textarea')
    if(reason&&!reason.value.trim())return reason
    return actionable('.tcg-change-new .tcg-primary:not(:disabled)')||reason
  }
  if(step.id==='tc-30' && q('.tcg-file-form input')){
    const field=typed('.tcg-file-form input')
    if(field&&!field.value.trim())return field
    return actionable('.tcg-file-form button:not(:disabled)')||field
  }
  if(step.id==='pl-17' && q('.pl-activity-panel .pl-comment-input input')){
    const field=typed('.pl-activity-panel .pl-comment-input input')
    if(field&&!field.value.trim())return field
    return actionable('.pl-activity-panel .pl-comment-input button:not(:disabled)')||field
  }
  if(step.id==='pl-35' && q('.pl-doc-properties .pl-edit-fields')){
    const editor=typed('.pl-doc-properties textarea')
    const original=q('.pl-doc-section.selected p')?.textContent||''
    if(editor&&editor.value===original)return editor
    return actionable('.pl-doc-properties .pl-command-actions .pl-primary')||editor
  }
  if(step.id==='pl-12' && q('.pl-item-details .pl-edit-fields')){
    const input=typed('.pl-item-details .pl-edit-fields input')
    const displayed=q('.pl-item-title h3')?.textContent||''
    if(input&&displayed.trim().endsWith(input.value.trim()))return input
    return actionable('.pl-commandbar button:first-child')||input
  }
  if(step.id==='tc-16' && q('.tcg-explorer-grid .tcg-form')){
    const input=typed('.tcg-explorer-grid .tcg-form input')
    const displayed=q('.tcg-explorer-grid .tcg-object-head h3')?.textContent||''
    if(input&&input.value.trim()===displayed.trim())return input
    return actionable('.tcg-explorer-grid .tcg-inspector-command.primary')||input
  }
  return null
}
function visibleTrainingTarget(candidate:Element):candidate is HTMLElement|SVGElement{
  if(!(candidate instanceof HTMLElement||candidate instanceof SVGElement))return false
  const bounds=candidate.getBoundingClientRect()
  const style=window.getComputedStyle(candidate)
  return bounds.width>=5 && bounds.height>=5
    && style.visibility!=='hidden' && style.display!=='none'
    && !candidate.closest('[hidden],[aria-hidden="true"]')
    && !(candidate instanceof HTMLElement && candidate.matches(':disabled'))
}

function selectorsFor(step:TrainingLesson<string>,brand:'polarion'|'teamcenter'):string[]{
  const n=Number(step.id.split('-').pop())
  const exact=(brand==='polarion'?pl:tc)[n]
  return exact||[]
}
export function findTrainingAction(step:TrainingLesson<string>,brand:'polarion'|'teamcenter'):HTMLElement|SVGElement|null{
  const container=document.querySelector(brand==='polarion'?'.pl-demo-root':'.tcg-page')
  if(!container)return null
  const guided=guidedFormTarget(step,container,brand)
  if(guided&&visibleTrainingTarget(guided))return guided
  for(const selector of selectorsFor(step,brand)){
    let matches:NodeListOf<Element>
    try{matches=container.querySelectorAll(selector)}catch{continue}
    for(const candidate of matches){
      if(visibleTrainingTarget(candidate))return candidate
    }
  }
  return null
}
export function trainingTargetCoverage(){
  return {polarion:Object.keys(pl).length,teamcenter:Object.keys(tc).length}
}
