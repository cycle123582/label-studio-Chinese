export const prepareColumns = (columns, hidden) => {
  if (!hidden?.length) return [...columns];
  return columns.filter((col) => {
    return !hidden.includes(col.id);
  });
};

export const getProperty = (object, path) => {
  try {
    const properties = path.split(".");
    let result = object;

    for (const property of properties) {
      result = result?.[property];
      if (result === undefined) {
        return undefined;
      }
    }

    return result;
  } catch {
    return undefined;
  }
};

const resolveStyle = (col, decoration, cellView) => {
  const result = {};

  [cellView, decoration].forEach((item) => {
    const cellStyle = (item ?? {}).style;

    if (cellStyle instanceof Function) {
      Object.assign(result, cellStyle(col) ?? {});
    } else {
      Object.assign(result, cellStyle ?? {});
    }
  });

  return result ?? {};
};

export const getStyle = (cellViews, col, decoration) => {
  const cellView = cellViews?.[col.type];
  const style = { width: 150 };
  const resolvedStyle = resolveStyle(col, decoration, cellView);

  Object.assign(style, resolvedStyle, {
    width: col.width ?? resolvedStyle.width ?? 150,
  });

  return style;
};
