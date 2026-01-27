import React from 'react';

interface BotorProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  texto: React.ReactNode;
}

const ButtonGeneral = ({ texto, className = '', ...props }: BotorProps) => {
  return (
    <button
      className={`btn text-white fw-bold px-4 py-2 ${className}`}
      {...props}
    >
      {texto}
    </button>
  );
};

export default ButtonGeneral;