type ErrorProps = { error: string };
export function Errorred({ error }: ErrorProps) {

  return (
    <div className="space-y-4">
      <p className="text-red-500 text-center">{error}</p>
    </div>);
}
