
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
      {date}

      {name}
      {email}
      {message}
    </div>
  );
}