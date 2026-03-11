'use client';

import Script from 'next/script';

export default function ChatWidget() {
    return (
        <>
            <link
                href="https://n8n.arxsolutions.cloud/assets/chat.css"
                rel="stylesheet"
            />
            <Script
                src="https://n8n.arxsolutions.cloud/assets/chat.js"
                onLoad={() => {
                    // @ts-ignore
                    if (window.createChat) {
                        // @ts-ignore
                        window.createChat({
                            webhookUrl: 'https://n8n.arxsolutions.cloud/webhook/5omZLwlqZP0qgok8/chat',
                            webhookConfig: {
                                method: 'POST',
                                headers: {}
                            },
                            targetElement: 'body',
                            showWelcomeMessage: true,
                            welcomeMessage: 'Olá! Sou o assistente virtual da Hyke Solutions. Como posso ajudar você hoje?',
                            title: 'Hyke Solutions Support',
                            description: 'Especialistas em Automação com IA',
                            backgroundColor: '#4f46e5',
                            primaryColor: '#6366f1',
                            userMessageColor: '#4f46e5',
                            assistantMessageColor: '#18181b',
                        });
                        console.log('N8N Chat Widget initialized successfully');
                    } else {
                        console.error('N8N Chat Widget: createChat function not found');
                    }
                }}
            />
        </>
    );
}
