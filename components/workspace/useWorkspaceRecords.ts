"use client";
import {useEffect,useState} from 'react';
import {readWorkspace,watchWorkspace} from '../../lib/workspace/records';
export function useWorkspaceRecords(){const [data,setData]=useState(readWorkspace);useEffect(()=>{const sync=()=>setData(readWorkspace());sync();return watchWorkspace(sync)},[]);return data;}
