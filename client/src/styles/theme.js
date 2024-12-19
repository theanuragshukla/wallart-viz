import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    polarNight: {
      100: "#2E3440",
      200: "#3B4252",
      300: "#434C5E",
      400: "#4C566A",
    },
    snow: {
      100: "#D8DEE9",
      200: "#E5E9F0",
      300: "#ECEFF4",
      400: "#FFFFFF",
    },
    frost: {
      100: "#8FBCBB",
      200: "#88C0D0",
      300: "#81A1C1",
      400: "#5E81AC",
    },

    aurora: {
      100: "#BF616A",
      200: "#D08770",
      300: "#EBCB8B",
      400: "#A3BE8C",
      500: "#B48EAD",
    },

    // nord theme, light mode

    background: "#D8DEE9",
    text: "#2E3440",
    primary: "#5E81AC",
    secondary: "#81A1C1",
    accent: "#88C0D0",
    muted: "#E5E9F0",
  },
  fonts: {
    body: "Monda, sans-serif",
    heading: "Monda, sans-serif",
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "bold",
        textTransform: "uppercase",
      },
      sizes: {
        lg: {
          h: "56px",
          fontSize: "lg",
          px: "32px",
        },
      },
      variants: {
        solid: (props) => ({
          bg: props.colorMode === "dark" ? "primary" : "secondary",
          color: "background",
          _hover: {
            bg: "accent",
          },
        }),
        outline: (props) => ({
          borderColor: "aurora.300",
          color: "auroa.300",
          _hover: {
            bg: "muted",
          },
        }),
        attention: (props) => ({
          bg: "aurora.300",
          color: "background",
          _hover: {
            bg: "polarnight.100",
          },
        }),
      },
    },

    Input: {
      baseStyle: {
        field: {
          _focus: {
            borderColor: "accent",
          },
        },
      },
    },
    Text: {
      baseStyle: {
        color: "text",
      },
    },
    Heading: {
      baseStyle: {
        color: "text",
      },
    },
  },

  styles: {
    global: {
      body: {
        transitionProperty: "background-color , color",
        transitionDuration: "500ms",
        transitionTimingFunction: "ease-in-out",
        fontFamily: "Monda, sans-serif",
      },
    },
  },
  config: {
    disableTransitionOnChange: false,
  },
});

export default theme;
