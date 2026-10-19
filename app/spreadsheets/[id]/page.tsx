"use client";
import {useParams} from "next/navigation";
import SpreadsheetPage from "../page";
export default function IndividualWorkbook(){const {id}=useParams();const sheetId=typeof id==="string"&&/^[a-z0-9-]{1,100}$/.test(id)?id:undefined;return <SpreadsheetPage initialSheetId={sheetId}/>}
