// jest.config.js
export default {
    "moduleFileExtensions": ["js", "json", "jsx", "ts", "tsx", "node"],
    "transform": {
      "^.+\\.jsx?$": "babel-jest"
    },
    "moduleNameMapper": {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy"
    }
  };
  