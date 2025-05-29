
export interface OpenAIResponse {
  text: string;
}

export const extractTextFromImage = async (
  imageBase64: string, 
  type: 'vehicle' | 'kilometer',
  apiKey?: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  const prompt = type === 'vehicle' 
    ? 'Extract the vehicle license plate number from this image. Return only the numbers and letters in the format XX-XXX-XX or similar.'
    : 'Extract the kilometer/mileage reading from this vehicle dashboard image. Return only the numeric value.';

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
        max_tokens: 100,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim() || '';
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
};
