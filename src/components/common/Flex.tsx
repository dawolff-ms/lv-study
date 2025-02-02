import * as React from "react";

type FlexProps = {
  /**
   * Change the root element of the flexbox. Default is `div`.
   */
  as?: React.ElementType;
  /**
   * Determines if the flexbox should be horizontal (row direction) or vertical (column direction). Default is `false` (vertical).
   */
  horizontal?: boolean;
  /**
   * Determines if the flexbox should grow to fill the available space. Also accepts a number to specify the flex-grow value.
   */
  grow?: boolean | React.CSSProperties["flexGrow"];
  /**
   * Specifies the `align-items` property of the flexbox.
   */
  alignItems?: React.CSSProperties["alignItems"];
  /**
   * Specifies the `justify-content` property of the flexbox.
   */
  justifyContent?: React.CSSProperties["justifyContent"];
  /**
   * Specifies the `gap` property of the flexbox.
   */
  gap?: React.CSSProperties["gap"];
  /**
   * Additional styles to apply to the flexbox.
   */
  style?: React.CSSProperties;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * A React component intended to simplify the use of flexboxes in your application. This implementation is
 * based on the Stack component from Fluent V1 (v8.X.X and below).
 *
 * @example
 * Instead of doing the following to create a flexbox:
 * ```
 * <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </div>
 * ```
 *
 * You can use this component like so:
 * ```
 * <Flex horizontal alignItems="center" justifyContent="space-between">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </Flex>
 * ```
 */
const Flex = React.forwardRef(function Flex(props: React.PropsWithChildren<FlexProps>, ref): JSX.Element {
  const {
    children,
    as: Element = "div",
    horizontal = false,
    grow,
    alignItems,
    justifyContent,
    gap,
    style,
    ...other
  } = props;

  return (
    <Element
      ref={ref}
      style={{
        display: "flex",
        flexFlow: horizontal ? "row" : "column",
        flexGrow: typeof grow === "boolean" ? Number(grow) : grow,
        alignItems,
        justifyContent,
        gap,
        ...style
      }}
      {...other}
    >
      {children}
    </Element>
  );
});

export default Flex;
