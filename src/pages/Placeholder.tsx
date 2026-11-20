interface PlaceholderProps {
  title: string;
  stage: number;
  description: string;
}

// Temporary page. Each one gets replaced with the real page in its stage.
export default function Placeholder({ title, stage, description }: PlaceholderProps) {
  return (
    <div className="card placeholder">
      <h2>{title}</h2>
      <p>{description}</p>
      <p className="muted">This page will be built in Stage {stage}.</p>
    </div>
  );
}