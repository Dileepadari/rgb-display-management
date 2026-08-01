import nextConfig from "eslint-config-next"

const eslintConfig = [
  ...nextConfig,
  {
    ignores: [".next/**", "node_modules/**", "Arduino_code/**"],
  },
  {
    rules: {
      // Experimental React Compiler rules flag standard, correct patterns
      // (mount-guard effects, localStorage restore-on-mount) as errors.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
    },
  },
]

export default eslintConfig
