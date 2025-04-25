interface TitleProps {
    title: string;
  }
  
  const Title: React.FC<TitleProps> = ({ title }) => {
    return (
      <h2 className="text-B2CAgray text-sm font-semibold mb-2">
        {title}
      </h2>
    );
  };
  
  export default Title;
  