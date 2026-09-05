import { Button } from "react-bootstrap";

export default function MyButton({text,variant,...props}) {
  return (
    <Button variant={variant}   {...props}>
      {text}
    </Button>
  );
}
