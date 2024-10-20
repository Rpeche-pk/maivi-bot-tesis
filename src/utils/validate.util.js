export const isImage = (msg) => {
    return Boolean(msg?.message?.imageMessage || msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage)
}

export const isAudio = (msg) => {
    return Boolean(msg?.message?.audioMessage || msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.audioMessage)
}

export const isVideo = (msg) => {
    return Boolean(msg.message?.videoMessage || msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage)
}