"use client";
import type {HRFormRecord} from "../../lib/hrForms";
import {hrRequestPrintData,hrRequestPrintTemplate,printTemplates} from "./registry";
import GenericHRRequestForm from "./GenericHRRequestForm";
import "./printForms.css";
import styles from "../RequestReview.module.css";
/** Same printable TSX template as the dedicated A4 viewer; no duplicate form values. */
export default function InlineRequestForm({record,employeeName,position,department}:{record:HRFormRecord;employeeName:string;position?:string;department?:string}){
 const data=hrRequestPrintData(record,employeeName,position,department);
 const id=hrRequestPrintTemplate[record.kind];const Template=id?printTemplates[id]:null;
 return <div className={`hr-print-scope ${styles.inlinePaper}`} aria-label={`${record.kind} submitted form preview`}>
  {Template?<Template data={data}/>:<GenericHRRequestForm data={data} kind={record.kind} additionalLabels={record.additionalLabels}/>}
 </div>;
}
