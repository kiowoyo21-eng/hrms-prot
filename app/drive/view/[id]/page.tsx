import DriveUploadViewer from "../../../../components/workspace/DriveUploadViewer";

export default async function Page({params}:{params:Promise<{id:string}>}){
 const {id}=await params;
 return <DriveUploadViewer id={id}/>;
}
