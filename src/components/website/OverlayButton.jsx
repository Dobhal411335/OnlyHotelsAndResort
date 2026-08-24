'use client'

import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react'

const OverlayButton = () => {
    const pathname = usePathname();
    const isExcluded = pathname?.startsWith('/admin') || pathname?.includes('/invoice') || pathname?.includes('/package/calculator/pdf');

    useEffect(() => {
        if (isExcluded) return;

        const options = {
            call: "+919762240419", // Call phone number
            whatsapp: "+919762240419", // WhatsApp number
            call_to_action: "OnlyHotel", // Call to action
            button_color: "#FF6550", // Color of button
            position: "right", // Position may be 'right' or 'left'
            order: "call,whatsapp", // Order of buttons
            pre_filled_message:"Dear Team OnlyHotel Greetings We are interested in+visiting your resort in the coming days and would+like+to+check+your+availability. Could you please share your current availability, along with the best available offers, seasonal packages, or group rates for our dates? Providing these details at your earliest convenience will help us finalize our travel plans ",
        };
        const proto = "https:",
            host = "getbutton.io",
            url = `${proto}//static.${host}/widget-send-button/js/init.js`;

        const s = document.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = url;
        s.onload = () => {
            if (typeof WhWidgetSendButton !== "undefined") {
                WhWidgetSendButton.init(host, proto, options);
            }
        };

        document.body.appendChild(s);

        return () => {
            if (document.body.contains(s)) {
                document.body.removeChild(s);
            }
            // Cleanup the actual widget DOM element if it was injected
            const widget = document.getElementById('wh-widget-send-button');
            if (widget) widget.remove();
        };
    }, [isExcluded]);

    return null;
}

export default OverlayButton