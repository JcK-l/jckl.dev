
interface EmailProps {
  name: string;
  email: string;
  message: string;
  date: string;
  isMail: boolean;
}

export const Email = ({name, email, message, date, isMail}: EmailProps) => {

  if (!isMail) return null;

  return (
    <div className="relative w-full">
      <span>From: {email}</span> <br />
      <span>To: mail@jckl.dev</span> <br />
      <span>{date}</span> 
      <br />
      <br />
      <svg height="2" width="100%">
        <line x1="0" y1="0" x2="75%" y2="0" style={{stroke: 'var(--color-text-color)', strokeWidth: 2}} />
      </svg>
      <br />
      <span className="h5-text text-titleColor">New email from {name}</span> <br />
      <br />
      <span>{message}</span> <br />
    </div>
  );
}