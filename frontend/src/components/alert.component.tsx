import "./alert.css"
import {useEffect, useState} from "react";

export default function AlertComponent({alert}) {
    const [visible, setVisible] = useState(true)
    const {text, status} = alert

    let colorClassName;
    useEffect(() => {
        setVisible(true); // Set visible to true whenever alertMessage changes
        const timeout = setTimeout(() => setVisible(false), 2000);

        return () => clearTimeout(timeout); // Clear the timeout when the component unmounts or alertMessage changes
    }, [alert]);

    switch (status) {
        case "SUCCESS":
            colorClassName = " green-alert"
            break
        case "WARNING":
            colorClassName = " yellow-alert"
            break
        case "ERROR":
            colorClassName = " red-alert"
            break
    }
    return <div className={"alert-container" + colorClassName}
                style={{opacity: visible ? 1.0 : 0.0, bottom: visible ? 50 : 0}}>
        <span>{text}</span>
    </div>
}