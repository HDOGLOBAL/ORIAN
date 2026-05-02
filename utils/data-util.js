

  export function replaceMongoIdInObject(obj) {
    if (!obj) return obj;

    if (Array.isArray(obj)) {
      return obj.map((item) => replaceMongoIdInObject(item));
    } else if (typeof obj === "object" && obj !== null) {
      if (obj._id && typeof obj._id === "object") {
        obj.id = obj._id.toString();
        delete obj._id;
      }

      const result = {};
      for (const key in obj) {
        if (obj[key] && typeof obj[key] === "object" && "buffer" in obj[key]) {
          // Handle Buffer/ObjectId fields
          result[key] = obj[key].toString();
        } else {
          result[key] = replaceMongoIdInObject(obj[key]);
        }
      }
      return result;
    }
    return obj;
  }

  export const replaceMongoIdInArray = (array) => {
    if (!array) return [];

    const mappedArray = array.map((item) => {
      // Convert _id to id
      const newItem = {
        id: item._id?.toString(),
        ...item,
      };

      // Remove the original _id
      delete newItem._id;

      // Handle any ObjectId/Buffer fields (like manufacturerId)
      for (const key in newItem) {
        if (newItem[key] && typeof newItem[key] === "object") {
          // Check if it's an ObjectId/Buffer
          if ("buffer" in newItem[key]) {
            newItem[key] = newItem[key].toString();
          }
          // Handle nested objects if needed
          else if (Array.isArray(newItem[key])) {
            newItem[key] = replaceMongoIdInArray(newItem[key]);
          }
        }
      }

      return newItem;
    });

    return mappedArray;
  };