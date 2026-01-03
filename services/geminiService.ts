
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRetentionMessage = async (clientName: string, lastSession: string | undefined) => {
  const model = 'gemini-3-flash-preview';
  const prompt = `Escreva uma mensagem curta, carinhosa e profissional para o WhatsApp de uma cliente chamada ${clientName} que não faz tranças com a Patrícia desde ${lastSession || 'algum tempo'}. O objetivo é lembrar da manutenção das tranças, perguntar como está o cabelo e oferecer um novo horário para renovar o visual. Patrícia é uma Transista profissional. Use emojis de forma moderada e um tom de empoderamento.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return `Olá ${clientName}, como estão suas tranças? Notei que já faz um tempinho que não cuidamos do seu visual. Que tal agendarmos uma renovação? Abraços, Patrícia Transista. ✨`;
  }
};

export const generateConfirmationMessage = async (clientName: string, date: string, time: string, meetLink: string) => {
  const model = 'gemini-3-flash-preview';
  const prompt = `Escreva uma mensagem de confirmação de agendamento de tranças para a cliente ${clientName}. 
  Data: ${date} às ${time}. 
  A profissional é Patrícia Transista. 
  A mensagem deve ser entusiasmada, profissional e lembrar a cliente de vir com o cabelo lavado e desembaraçado se necessário.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return `Olá ${clientName}, seu horário com Patrícia Transista está confirmado para ${date} às ${time}. Mal posso esperar para transformar seu visual! ✨`;
  }
};
