import { Resource } from "./ResourceCard";

interface Props {
  resource: Resource;
}

export function ResourceDebugInfo({ resource }: Props) {
  return (
    <div className="bg-yellow-100 border border-yellow-400 rounded p-2 text-xs mb-2">
      <div className="font-bold">DEBUG INFO:</div>
      <div>ID: {resource.id}</div>
      <div>Nombre: {resource.name}</div>
      <div>Creator ID: {resource.creator_id || 'NULL'}</div>
      <div>Author Name: {resource.author?.name || 'NULL'}</div>
      <div>Author Avatar: {resource.author?.avatar_url || 'NULL'}</div>
      <div>Author Object: {JSON.stringify(resource.author)}</div>
    </div>
  );
} 