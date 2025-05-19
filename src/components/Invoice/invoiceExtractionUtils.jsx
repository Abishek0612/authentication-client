import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const extractInvoiceData = async (file) => {
  if (!file) {
    throw new Error("No file provided for extraction");
  }

  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "Gemini API key not found. Please add VITE_GEMINI_API_KEY to your environment variables."
      );
    }

    const imageUrl = URL.createObjectURL(file);

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelInstance = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            invoiceNumber: {
              type: SchemaType.STRING,
              description: "The invoice number",
            },
            invoiceAmount: {
              type: SchemaType.STRING,
              description: "The total amount of the invoice",
            },
            invoiceDate: {
              type: SchemaType.STRING,
              description: "The date of the invoice in DD-MM-YYYY format",
            },
            invoiceItems: {
              type: SchemaType.ARRAY,
              description: "List of items in the invoice",
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  itemName: {
                    type: SchemaType.STRING,
                    description: "The name of the item",
                  },
                  item_HSN_SAC: {
                    type: SchemaType.STRING,
                    description:
                      "The HSN/SAC code of the item. Leave empty string if not available or unsure",
                  },
                  itemQuantity: {
                    type: SchemaType.STRING,
                    description:
                      "The quantity of the item. Leave empty string if not available or unsure",
                  },
                  itemRate: {
                    type: SchemaType.STRING,
                    description:
                      "The rate of the item. Leave empty string if not available or unsure",
                  },
                  itemAmount: {
                    type: SchemaType.STRING,
                    description: "The amount of the item",
                  },
                },
                required: ["itemName", "itemAmount"],
              },
            },
          },
        },
      },
    });

    const prompt =
      "Extract the key information from the invoice image precisely. Format dates as DD-MM-YYYY.";

    const image_metadata = {
      inlineData: {
        data: await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        }),
        mimeType: file.type,
      },
    };

    const result = await modelInstance.generateContent([
      prompt,
      image_metadata,
    ]);

    const responseText = JSON.parse(result.response.text());

    const invoiceItemsWithIds = responseText.invoiceItems.map((item, id) => {
      return { ...item, id: id };
    });

    return {
      ...responseText,
      imageUrl: imageUrl,
      invoiceItems: invoiceItemsWithIds,
    };
  } catch (error) {
    console.error("Error extracting invoice data:", error);
    throw new Error(`Failed to extract invoice data: ${error.message}`);
  }
};

export { extractInvoiceData };
