export type HTMLElementDimension = { offsetWidth: number; offsetHeight: number }

export const getDimension = (node: HTMLElement) => {
	const sizeChanged = () => {
    const [ offsetWidth, offsetHeight ] =  [node.offsetWidth, node.offsetHeight ]
    node.dispatchEvent(new CustomEvent<HTMLElementDimension>("sizeChanged", { detail: { offsetWidth, offsetHeight }}));
	};

  let resizeObserver = new ResizeObserver(sizeChanged)
  resizeObserver.observe(node)

	return {
		destroy() {
			resizeObserver.disconnect();
		}
	};
}
