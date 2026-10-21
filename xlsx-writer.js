/* Small offline OOXML writer: literal strings, numeric cells, filters, frozen headers.
   ZIP entries use STORE; no CDN, macros, external formulas or upload is needed. */
(() => {
  'use strict';
  const encoder=new TextEncoder();
  const xml=v=>String(v??'').replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g,'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
  const col=n=>{let v='';for(n++;n;n=Math.floor((n-1)/26))v=String.fromCharCode(65+(n-1)%26)+v;return v;};
  const crcTable=Array.from({length:256},(_,n)=>{for(let i=0;i<8;i++)n=(n&1)?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
  function crc32(bytes){let c=0xffffffff;for(const b of bytes)c=crcTable[(c^b)&255]^(c>>>8);return (c^0xffffffff)>>>0;}
  function header(size,fields){const b=new Uint8Array(size),v=new DataView(b.buffer);for(const [at,value,length] of fields)length===2?v.setUint16(at,value,true):v.setUint32(at,value,true);return b;}
  function zip(entries){
    const parts=[],directory=[];let offset=0,centralSize=0;
    for(const [path,value] of entries){
      const name=encoder.encode(path),data=encoder.encode(value),crc=crc32(data);
      const local=header(30,[[0,0x04034b50,4],[4,20,2],[6,0x800,2],[12,33,2],[14,crc,4],[18,data.length,4],[22,data.length,4],[26,name.length,2]]);
      const central=header(46,[[0,0x02014b50,4],[4,20,2],[6,20,2],[8,0x800,2],[14,33,2],[16,crc,4],[20,data.length,4],[24,data.length,4],[28,name.length,2],[42,offset,4]]);
      parts.push(local,name,data);directory.push(central,name);offset+=local.length+name.length+data.length;centralSize+=central.length+name.length;
    }
    return new Blob([...parts,...directory,header(22,[[0,0x06054b50,4],[8,entries.length,2],[10,entries.length,2],[12,centralSize,4],[16,offset,4]])],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  }
  function workbook(sheets){
    const ns='http://schemas.openxmlformats.org/spreadsheetml/2006/main';
    const entries=[['[Content_Types].xml',`<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${sheets.map((_,i)=>`<Override PartName="/xl/worksheets/sheet${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}</Types>`],
      ['_rels/.rels','<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'],
      ['xl/workbook.xml',`<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="${ns}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${sheets.map((s,i)=>`<sheet name="${xml(s.name)}" sheetId="${i+1}" r:id="rId${i+1}"/>`).join('')}</sheets></workbook>`],
      ['xl/_rels/workbook.xml.rels',`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets.map((_,i)=>`<Relationship Id="rId${i+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i+1}.xml"/>`).join('')}<Relationship Id="rId${sheets.length+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`],
      ['xl/styles.xml',`<?xml version="1.0" encoding="UTF-8"?><styleSheet xmlns="${ns}"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><color rgb="FFFFFFFF"/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF163F44"/></patternFill></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyAlignment="1"><alignment wrapText="1" vertical="top"/></xf><xf numFmtId="3" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`]];
    sheets.forEach((s,i)=>{
      const columns=s.columns||Array.from(new Set(s.rows.flatMap(r=>Object.keys(r))));
      const data=[columns,...s.rows.map(r=>columns.map(k=>r[k]))];
      const links=[];
      const cells=data.map((row,ri)=>`<row r="${ri+1}"${ri===0?' ht="46" customHeight="1"':''}>${row.map((v,ci)=>{
        if(v===null||v===undefined||v==='')return '';
        const ref=col(ci)+(ri+1),style=ri===0?' s="1"':(/INR| rank$| allotments$/.test(columns[ci])?' s="2"':'');
        if(ri>0&&typeof v==='string'&&(/^(https?:\/\/|exports\/)/.test(v)))links.push({ref,url:v.startsWith('exports/')?'https://pramod-zillella.github.io/neet-specialty-knowledge-base/'+v:v});
        if(typeof v==='number'&&Number.isFinite(v))return `<c r="${ref}"${style}><v>${v}</v></c>`;
        const text=typeof v==='object'?JSON.stringify(v):v;
        return `<c r="${ref}" t="inlineStr"${style}><is><t xml:space="preserve">${xml(text)}</t></is></c>`;
      }).join('')}</row>`).join('');
      entries.push([`xl/worksheets/sheet${i+1}.xml`,`<?xml version="1.0" encoding="UTF-8"?><worksheet xmlns="${ns}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><dimension ref="A1:${col(columns.length-1)}${data.length}"/><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>${columns.map((k,n)=>`<col min="${n+1}" max="${n+1}" width="${/College|source|notes|Guidance|basis/.test(k)?42:22}" customWidth="1"/>`).join('')}</cols><sheetData>${cells}</sheetData><autoFilter ref="A1:${col(columns.length-1)}${data.length}"/>${links.length?`<hyperlinks>${links.map((v,n)=>`<hyperlink ref="${v.ref}" r:id="rId${n+1}"/>`).join('')}</hyperlinks>`:''}</worksheet>`]);
      if(links.length)entries.push([`xl/worksheets/_rels/sheet${i+1}.xml.rels`,`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${links.map((v,n)=>`<Relationship Id="rId${n+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="${xml(v.url)}" TargetMode="External"/>`).join('')}</Relationships>`]);
    });
    return zip(entries);
  }
  window.SmallXlsx={workbook};
})();
