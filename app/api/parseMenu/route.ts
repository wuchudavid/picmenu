/* eslint-disable @typescript-eslint/no-explicit-any */
import { Together } from "together-ai";

// Add observability if a Helicone key is specified, otherwise skip
const options: ConstructorParameters<typeof Together>[0] = {};
if (process.env.HELICONE_API_KEY) {
  options.baseURL = "https://together.helicone.ai/v1";
  options.defaultHeaders = {
    "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
    "Helicone-Property-MENU": "true",
  };
}

// Check if Together AI API key is available
if (!process.env.TOGETHER_API_KEY) {
  console.warn("TOGETHER_API_KEY is not set. API will not function properly.");
}

const together = new Together({
  ...options,
  apiKey: process.env.TOGETHER_API_KEY || "dummy-key",
});

export async function POST(request: Request) {
  // Check if API key is available
  if (!process.env.TOGETHER_API_KEY) {
    return Response.json({ 
      error: "API key not configured. Please set TOGETHER_API_KEY environment variable." 
    }, { status: 500 });
  }

  const { menuUrl } = await request.json();

  console.log({ menuUrl });

  if (!menuUrl) {
    return Response.json({ error: "No menu URL provided" }, { status: 400 });
  }

  // Handle both URLs and base64 data
  let imageUrl = menuUrl;
  if (menuUrl.startsWith('data:image/')) {
    // If it's base64 data, we can use it directly
    imageUrl = menuUrl;
  } else if (!menuUrl.startsWith('http')) {
    return Response.json({ error: "Invalid image URL provided" }, { status: 400 });
  }

  const systemPrompt = `You are given an image of a menu. Your job is to take each item in the menu and convert it into the following JSON format:

[{"name": "name of menu item", "price": "price of the menu item", "description": "description of menu item"}, ...]

  Please make sure to include all items in the menu and include a price (if it exists) & a description (if it exists). ALSO PLEASE ONLY RETURN JSON. IT'S VERY IMPORTANT FOR MY JOB THAT YOU ONLY RETURN JSON.
  `;

  let output;
  try {
    output = await together.chat.completions.create({
      model: "meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo",
      messages: [
        {
          role: "user",
          // @ts-expect-error api is not typed
          content: [
            { type: "text", text: systemPrompt },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
    });
  } catch (error: any) {
    console.error("Together AI API error:", error);
    
    if (error.status === 429) {
      return Response.json({ 
        error: "Rate limit exceeded. Please wait a few minutes and try again. The model has a limit of 6 queries per minute." 
      }, { status: 429 });
    }
    
    return Response.json({ 
      error: "Failed to process menu image. Please try again later." 
    }, { status: 500 });
  }

  const menuItems = output?.choices[0]?.message?.content;

  // Parse the menu items directly without additional validation
  let menuItemsJSON;
  try {
    // Try to parse the response directly
    menuItemsJSON = JSON.parse(menuItems || "[]");
    console.log({ menuItemsJSON });
  } catch (parseError) {
    console.error("Failed to parse menu items:", parseError);
    console.log("Raw menu items:", menuItems);
    
    // If parsing fails, try to extract JSON from the response
    const jsonMatch = menuItems?.match(/\[.*\]/);
    if (jsonMatch) {
      try {
        menuItemsJSON = JSON.parse(jsonMatch[0]);
        console.log("Extracted JSON:", menuItemsJSON);
      } catch (extractError) {
        console.error("Failed to extract JSON:", extractError);
        return Response.json({ 
          error: "Failed to parse menu items from AI response. Please try again." 
        }, { status: 500 });
      }
    } else {
      return Response.json({ 
        error: "Failed to parse menu items from AI response. Please try again." 
      }, { status: 500 });
    }
  }

  // Create an array of promises for parallel image generation
  const imagePromises = menuItemsJSON.map(async (item: any) => {
    try {
      console.log("processing image for:", item.name);
      const response = await together.images.create({
        prompt: `A picture of food for a menu, hyper realistic, highly detailed, ${item.name}, ${item.description}.`,
        model: "black-forest-labs/FLUX.1-schnell",
        width: 1024,
        height: 768,
        steps: 5,
        // @ts-expect-error - this is not typed in the API
        response_format: "base64",
      });
      item.menuImage = response.data[0];
      return item;
    } catch (imageError: any) {
      console.error(`Failed to generate image for ${item.name}:`, imageError);
      // Return item without image if generation fails
      item.menuImage = { b64_json: "" };
      return item;
    }
  });

  // Wait for all images to be generated
  await Promise.all(imagePromises);

  return Response.json({ menu: menuItemsJSON });
}

export const maxDuration = 60;
