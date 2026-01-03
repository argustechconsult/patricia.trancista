
export const generateRetentionMessage = async (clientName: string, lastSession: string | undefined) => {
    return `Olá ${clientName}, como estão suas tranças? Notei que já faz um tempinho que não cuidamos do seu visual. Que tal agendarmos uma renovação? Abraços, Patrícia Transista. ✨`;
};

export const generateConfirmationMessage = async (clientName: string, date: string, time: string, meetLink: string) => {
    return `Olá ${clientName}, seu horário com Patrícia Transista está confirmado para ${date} às ${time}. Mal posso esperar para transformar seu visual! ✨`;
};
