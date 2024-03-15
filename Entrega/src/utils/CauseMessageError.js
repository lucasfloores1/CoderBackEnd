export const generatorProductError = (data) => {
  return `All the fields are required.
  List of parameters recieved in the request:
  - title  : ${data.title}
  - description   : ${data.description}
  - price       : ${data.price}
  - stock         : ${data.stock}
  - code         : ${data.code}
  - type         : ${data.type}
  - owner         : ${data.owner}
  - isAdmin       : ${data.isAdmin}
  `;
};

export const productIdError = (id) => {
  return `A valid product id is required.
    Value recieved: ${id}
  `;
};

export const cartIdError = (id) => {
  return `A valid cart id is required.
    Value recieved: ${id}
  `;
};
