import {useState, useEffect} from 'react';
import './TextDropAnimation.css'; // Import your CSS for styling

function TextStaggeredAnimation({text, animate}) {
    // const [text, setText] = useState('Initial Text');
    const [animationKey, setAnimationKey] = useState(0);

    useEffect(() => {
        // Update animation key when text changes
        setAnimationKey(animationKey + 1);
    }, [text]);

    return (
        <span style={{textAlign: "center", marginRight: 5}}
              className={animate ? `animated-text` : ""}
              key={animationKey}>
      {text.split('').map((char, index) => (
          <span style={{letterSpacing: 2, animationDelay: `${index * 0.1}s`}}
                className={animate ? "animated-letter" : ""} key={index}>
          {char}
        </span>

      ))}

    </span>
    );

}

export default TextStaggeredAnimation;
