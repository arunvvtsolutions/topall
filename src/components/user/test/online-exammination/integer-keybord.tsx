import { useMediaQuery } from '@/hooks/use-media-query';
import React from 'react';

const IntegerKeybord = ({ value, setValue }: { value: string; setValue: (value: string) => void }) => {
  const inputRef = React.useRef<any>();
  const [pos, setPos] = React.useState<number>();
  const isMobile = useMediaQuery('(max-width: 767px)');

  React.useEffect(() => {
    if (inputRef.current.setSelectionRange) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(pos, pos);
    } else if (inputRef.current.createTextRange) {
      var range = inputRef.current.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  }, [pos]);

  const buttons = [
    ['Backspace'],
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['0', '.', '-'],
    ['left', 'right'],
    ['Clear All']
  ];
  //   const [value, setValue] = React.useState(value);

  const handleBtnClick = (btnKey: any) => {
    inputRef.current.focus();
    const position = inputRef.current.selectionStart;
    if (btnKey != 'Backspace' && btnKey != 'left' && btnKey != 'right' && btnKey != 'Clear All') {
      const newStr = value.slice(0, position) + btnKey + value.slice(position);
      if (45 <= btnKey.charCodeAt(0) && btnKey.charCodeAt(0) <= 57) {
        setValue(newStr);
        setPos(position + 1);
      }
    } else if (btnKey === 'Backspace') {
      if (position > 0) {
        // setValue((prev: any) => prev.slice(0, position - 1) + prev.slice(position));
        setValue(value.slice(0, position - 1) + value.slice(position));
        setPos(position - 1);
      }
    } else if (btnKey === 'Clear All') {
      setValue('');
      setPos(0);
    } else if (btnKey === 'left') {
      if (position > 0) {
        setPos(position - 1);
      }
    } else if (btnKey === 'right') {
      if (position < value?.length) {
        setPos(position + 1);
      }
    }
  };
  // onChange using keyboard
  const handleOnInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let str = event.target.value;
    const position = inputRef.current.selectionStart;
    ((45 <= str.charCodeAt(position - 1) && str.charCodeAt(position - 1) <= 57) || str === '' || str.includes('_')) &&
      setValue(event.target.value);
  };

  return (
    <div className="flex flex-col items-center space-y-2 rounded border-solid border-gray-300 md:border md:p-5">
      <div className="pb-1 text-sm font-semibold uppercase text-gray-400">Enter your answer here</div>
      <>
        <div className="flex w-full flex-col items-center">
          <div className="w-full md:w-[350px] md:border md:border-black md:p-4">
            <div>
              <input
                ref={inputRef}
                type={'text'}
                value={value}
                // disabled={disabled}
                onChange={handleOnInputChange}
                className="form-input mb-2 w-full rounded-md border px-3 py-2 outline-0 focus:ring-0"
              />
            </div>
            {!isMobile && (
              <div className="flex w-full flex-col gap-2 justify-self-center bg-gray-100 p-3">
                {buttons.map((row: any, idx: any) => {
                  return (
                    <div className="flex gap-2" key={`row - ${idx}`}>
                      {buttons[idx].map((btn: any, idx2: any) => {
                        return (
                          <button
                            className="w-full rounded-md border border-black bg-white"
                            key={`btn-${idx2}`}
                            onClick={() => {
                              handleBtnClick(btn);
                            }}
                          >
                            {buttons[idx][idx2] == 'left' ? '←' : buttons[idx][idx2] == 'right' ? '→' : buttons[idx][idx2]}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </>
    </div>
  );
};

export default IntegerKeybord;
