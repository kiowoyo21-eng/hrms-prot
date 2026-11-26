"use client";
import {usePublishModuleAlerts} from '../ModuleAlerts';
import {useWorkspaceRecords} from './useWorkspaceRecords';
import {type Actor,canSeeNotice,canSeeTicket} from '../../lib/workspace/records';
export default function WorkspaceAlerts({actor}:{actor:Actor}){const state=useWorkspaceRecords();usePublishModuleAlerts('documents',state.notices.filter(n=>canSeeNotice(actor,n)&&n.status==='Awaiting company signature'&&n.signer===actor.username).map(n=>({id:n.id,title:'Signature requested',detail:n.id,branch:n.branch,level:'normal' as const})),'workspace-signing');usePublishModuleAlerts('it-support',state.tickets.filter(t=>canSeeTicket(actor,t)&&t.state!=='Resolved'&&(actor.role==='Super Admin'&&(!t.owner||t.owner===actor.username))).map(t=>({id:t.id,title:'IT support action',detail:t.id,branch:t.branch,level:t.severity==='Critical'?'urgent' as const:'normal' as const})),'workspace-it');return null}
