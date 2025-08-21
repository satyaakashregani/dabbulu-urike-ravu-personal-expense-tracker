const categorizationRules: Record<string, string[]> = {
  '2': ['zomato', 'swiggy', 'food', 'restaurant', 'hotel', 'mess', 'biryani', 'pizza', 'burger'],
  '3': ['tiffin', 'lunch', 'breakfast', 'dinner'],
  '4': ['dmart', 'big bazaar', 'spencer', 'reliance fresh', 'grocery', 'supermarket', 'vegetables', 'fruits'],
  '5': ['phonepe', 'paytm', 'gpay', 'amazon pay', 'wallet', 'upi'],
  '6': ['uber', 'ola', 'metro', 'auto', 'bus', 'taxi', 'cab', 'bmtc', 'dmrc', 'commute'],
  '7': ['jio', 'airtel', 'vi', 'vodafone', 'idea', 'mobile', 'recharge', 'data', 'internet'],
  '8': ['electricity', 'water', 'gas', 'utility', 'power', 'bill'],
  '9': ['movie', 'cinema', 'netflix', 'prime', 'hotstar', 'entertainment', 'game', 'spotify'],
  '10': ['pharmacy', 'medicine', 'doctor', 'hospital', 'health', 'medical', 'apollo'],
  '11': ['amazon', 'flipkart', 'shopping', 'myntra', 'clothes', 'shoes'],
  '12': ['flight', 'train', 'hotel', 'travel', 'irctc', 'makemytrip', 'goibibo']
};

export const suggestCategory = (note: string): string | null => {
  if (!note) return null;
  
  const lowerNote = note.toLowerCase();
  
  for (const [categoryId, keywords] of Object.entries(categorizationRules)) {
    if (keywords.some(keyword => lowerNote.includes(keyword))) {
      return categoryId;
    }
  }
  
  return null;
};