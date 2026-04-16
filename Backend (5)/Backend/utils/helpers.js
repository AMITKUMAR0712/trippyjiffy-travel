// utils/helpers.js (English Version)

export function getJsonValue(jsonString) {
    // Return a default English message if the string is empty or null
    if (!jsonString) return 'Information not available.'; 
    
    try {
        const data = JSON.parse(jsonString);
        let text = '';
        
        // Handle the Editor.js JSON format
        if (data.blocks && Array.isArray(data.blocks)) {
            for (const block of data.blocks) {
                // Process paragraph/header blocks
                if (block.data && block.data.text) {
                    text += block.data.text + ' ';
                } 
                // Process list blocks (ordered/unordered)
                else if (block.data && block.data.items && Array.isArray(block.data.items)) {
                    for (const item of block.data.items) {
                        text += `* ${item.content} \n`; // Use '*' for list items
                    }
                }
            }
        }
        
        // Remove HTML tags (like <b>, <i>, <br>) and trim whitespace
        return text.replace(/<[^>]*>/g, '').trim() || 'Information not available.';

    } catch (e) {
        // Fallback if JSON parsing fails (e.g., if the field contains plain string instead of JSON)
        // We trim HTML tags and truncate the string to avoid giant text blocks on error.
        
        // console.error("JSON parsing error:", e); // Uncomment this for debugging
        
        const plainText = jsonString.replace(/<[^>]*>/g, '').trim();
        
        // Return a truncated version of the raw text if it's too long, otherwise return the whole text
        if (plainText.length > 500) {
            return plainText.substring(0, 500) + '... (Raw data)';
        }
        
        return plainText || 'Information not available.';
    }
}