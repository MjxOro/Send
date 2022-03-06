module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './src/**/**/*.{js,jsx,ts,tsx}',
    './src/**/**/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      screens:{
        'lg': '1025px'
      }
    }
  },
  plugins: []
};
