/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [],
  theme: {
    // listStyleType: {
    //   none: 'none',
    //   disc: 'disc',
    //   decimal: 'decimal',
    //   square: 'square',
    //   roman: 'upper-roman',
    // },
    extend: {
      colors: {
        "primary-light": "#F7F8FC",
        "secondary-light": "#FFFFFF",
        "ternary-light": "#f6f7f8",

        "primary-dark": "#0D2438",
        "secondary-dark": "#102D44",
        "ternary-dark": "#1E3851",

        "m1": "#5D5C61",
        "m2": "#379683",
        "m3": "#7395AE",
        "m4": "#557A95",
        "m5": "#B1A296",

        // Distinct minimal tokens
        accent: "#9CA3AF",
        divider: "#E9ECEF",
        dividerDark: "#404040"
      },
      boxShadow: {
        soft: "0 2px 6px rgba(0,0,0,0.08)",
        ring: "0 0 0 1px var(--divider)",
        ringDark: "0 0 0 1px var(--divider-dark)",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // ...
  ],
}

