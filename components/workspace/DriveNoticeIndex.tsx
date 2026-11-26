"use client";
import {useState} from 'react';
import {type Actor,canSeeNotice} from '../../lib/workspace/records';
import {useWorkspaceRecords} from './useWorkspaceRecords';
import styles from './NativeWorkspace.module.css';
export default function DriveNoticeIndex({actor,query}:{actor:Actor;query:string}){const state=useWorkspaceRecords();const [selected,setSelected]=useState('');const rows=state.notices.filter(n=>canSeeNotice(actor,n)&&n.status!=='Awaiting company signature'&&`${n.id} ${n.subject} ${n.kind}`.toLowerCase().includes(query.toLowerCase()));const n=rows.find(x=>x.id===selected);return <details className={styles.panel}><summary>Issued documents · linked directory ({rows.length})</summary><p className={styles.hint}>References to the same issued record, not duplicate uploads. Confidential records remain restricted in this demo.</p>{rows.map(r=><button key={r.id} className="secondary" onClick={()=>setSelected(r.id)}>{r.kind} · {r.subject} · {r.status}</button>)}{n&&<article className={styles.detail}><h4>{n.subject}</h4><p>{n.id} · {n.branch} · {n.status}</p><pre>{n.body}</pre><p>Employee action: {n.status}</p></article>}</details>}
