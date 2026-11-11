// This pure converter retains the source answers exactly, including whitespace.
function convert(source){
  if(source.memberId!=='003')throw Error('Unexpected member');
  const sessions=source.sheets.filter(s=>/^第\d+回目のワーク$/.test(s.title)).map(sheet=>{
    const number=Number(sheet.title.match(/^第(\d+)/)[1]),workQuestions=[],importedAnswers={};
    let section='',pending=null;
    sheet.values.forEach((row,index)=>{
      row=row||[];const label=String(row[0]||'').trim();
      if(/^(ステップ|STEP)/i.test(label))section=row[0];
      if(label==='質問'){
        if(pending!==null)throw Error('Missing answer row');
        const question=row[2]??'';pending=workQuestions.length;
        workQuestions.push({question:question.split('【記入例】')[0].trim(),sourceQuestionMissing:!question.trim(),label:'佑衣さんの回答',section,sourceCell:`C${index+1}`});
      }else if(label==='回答欄'){
        if(pending===null)throw Error('Unpaired answer');
        importedAnswers[String(pending)]={text:row[2]??'',sourceCell:`C${index+1}`};pending=null;
      }
    });
    if(pending!==null)throw Error('Missing answer row');
    return {memberId:'003',number,workTitle:sheet.values[0][0],workQuestions,importedAnswers,
      workDescription:sheet.values.filter(r=>r&&['ねらい','ワーク内容'].includes(r[0])).map(r=>r[2]).filter(Boolean),
      workNote:sheet.values.filter(r=>r&&r[0]==='ポイント').map(r=>r[2]||'').join('\n'),
      source:{sheetId:sheet.sheetId,sheetTitle:sheet.title}};
  }).sort((a,b)=>a.number-b.number);
  if(sessions.length!==32||sessions.some((s,i)=>s.number!==i+1))throw Error('Wrong round mapping');
  const supplementary=source.sheets.filter(s=>!/^第\d+回目のワーク$/.test(s.title)).map(s=>({memberId:'003',sheetId:s.sheetId,title:s.title,
    cells:s.values.flatMap((r,i)=>(r||[]).map((text,j)=>({cell:`${String.fromCharCode(65+j)}${i+1}`,text})).filter(c=>c.text))}));
  return {schemaVersion:1,memberId:'003',memberName:source.memberName,sourceCapturedAt:source.capturedAt,sessions,supplementary};
}
module.exports=convert;
if(require.main===module){const fs=require('node:fs');process.stdout.write(JSON.stringify(convert(JSON.parse(fs.readFileSync(process.argv[2],'utf8'))),null,2));}
