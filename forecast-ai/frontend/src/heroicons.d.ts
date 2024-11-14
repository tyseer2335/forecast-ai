/**
 * Declaration Module for Hero Icons - `@heroicons/react/24/outline`
 * 
 * This declaration file defines the types for the `EyeIcon` and `EyeSlashIcon` components from the
 * `@heroicons/react/24/outline` package. Each icon is a React component that accepts standard SVG properties.
 *
 * Declarations:
 * - `EyeIcon`: A React component representing an eye icon, allowing customization through `SVGSVGElement` properties.
 * - `EyeSlashIcon`: A React component representing an eye with a slash (visibility off), also customizable through `SVGSVGElement` properties.
 * 
 * Usage:
 * Import `EyeIcon` and `EyeSlashIcon` from `@heroicons/react/24/outline` and use them as SVG icons within React components.
 */

declare module '@heroicons/react/24/outline' {
    export const EyeIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    export const EyeSlashIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }
  