import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TemplateThree } from './TemplateThree';
import { TemplateTwo } from './TemplateTwo';
import { TemplateOne } from './TemplateOne';
import { checkEqual } from '../../utils/selectorCheck';

// decide temples
function Slider({ slide }) {
  const template = {
    one: <TemplateOne slide={slide} />,
    two: <TemplateTwo slide={slide} />,
    three: <TemplateThree slide={slide} />,
  };
  return template[slide?.layout];
}

let interval;
export default function Index() {
  const { slides } = useSelector((state) => state.content, checkEqual);
  const [count, setCount] = useState(0);
  const { pending } = useSelector((state) => state.navigation);

  useEffect(() => {
    if (!pending) {
      interval = setInterval(() => {
        if (count >= slides.length - 1) {
          setCount(0);
        } else {
          setCount((pre) => pre + 1);
        }
      }, 3000);
    }
    return () => { clearInterval(interval); };
  });

  useEffect(() => {
    setCount(0);
  }, [slides]);

  return <Slider slide={slides[count]} />;
}
