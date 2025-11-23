/**
 * A standard React component for the POC table UI.
 * It receives all context and functionality as props.
 */
export const POCUI = ({
  // React dependencies (from context)
  useState,
  useEffect,
  useMemo,

  // Component Data & State
  data, // Expect `data` prop, not `loadedData`
  regions,
  state,
  metadata,

  // Actions
  addRegion,
  saveState,
  saveMetadata,
  getTagValue,
  setTagValue,
}) => {
  // All style objects, helper functions, and sub-components are now defined inside the main component's closure.

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px",
  };
  const thStyle = {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#ddd",
    padding: "8px",
    backgroundColor: "#f2f2f2",
    textAlign: "left",
  };
  const tdStyle = {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#ddd",
    padding: "8px",
  };
  const buttonStyle = {
    marginRight: "5px",
    padding: "5px 10px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#ccc",
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "white",
  };
  const selectedButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#4CAF50",
    color: "white",
    borderColor: "#4CAF50",
  };
  const selectedBadButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#f44336", // Red color
    color: "white",
    borderColor: "#f44336",
  };
  const textareaStyle = {
    width: "100%",
    padding: "5px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#ccc",
    borderRadius: "4px",
    minHeight: "40px",
    resize: "vertical",
  };

  // A simple, dependency-free CSV parser.
  const simpleCSVParser = (csvText) => {
    if (!csvText || typeof csvText !== "string") {
      return { headers: [], rows: [] };
    }

    const lines = csvText.trim().split(/\r?\n/);
    const headers = lines[0].split(",");
    const rows = lines.slice(1).map((line) => {
      const values = line.split(",");
      return headers.reduce((obj, header, index) => {
        obj[header.trim()] = values[index]?.trim();
        return obj;
      }, {});
    });

    return { headers, rows };
  };

  // A single star component
  const Star = ({ selected, onSelect }) => (
    <button
      type="button"
      onClick={onSelect}
      style={{
        cursor: "pointer",
        color: selected ? "gold" : "grey",
        fontSize: "20px",
        background: "none",
        border: "none",
        padding: 0,
        margin: 0,
      }}
    >
      ★
    </button>
  );

  // The component that groups stars together
  const StarRating = ({ totalStars = 5, rating = 0, onRate }) => {
    return (
      <div>
        {[...Array(totalStars)].map((_, i) => (
          <Star key={i} selected={i < rating} onSelect={() => onRate(i + 1)} />
        ))}
      </div>
    );
  };

  // New component for the two questions
  const QuestionUI = ({ getTagValue, setTagValue }) => {
    // The names of the <Choices> tags in your LS config
    const tagAB = "choice1";
    const tagXY = "choice2";

    // Get the current values directly on every render.
    const choiceAB = getTagValue(tagAB)?.choices[0];
    const choiceXY = getTagValue(tagXY)?.choices[0];

    const handleSelect = (tag, value) => {
      const currentVal = getTagValue(tag)?.[0];
      const newValue = currentVal === value ? null : value;
      setTagValue(tag, newValue);
    };

    return (
      <div
        style={{
          marginBottom: "20px",
          padding: "10px",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "#eee",
          borderRadius: "4px",
        }}
      >
        <h4>Quick Questions</h4>
        <div style={{ marginBottom: "10px" }}>
          <p style={{ margin: "0 0 5px 0" }}>1. Is it an 'A' or a 'B'?</p>
          <button
            type="button"
            style={choiceAB === "A" ? selectedButtonStyle : buttonStyle}
            onClick={() => handleSelect(tagAB, "A")}
          >
            A
          </button>
          <button
            type="button"
            style={choiceAB === "B" ? selectedButtonStyle : buttonStyle}
            onClick={() => handleSelect(tagAB, "B")}
          >
            B
          </button>
        </div>
        <div>
          <p style={{ margin: "0 0 5px 0" }}>2. Is it an 'X' or a 'Y'?</p>
          <button
            type="button"
            style={choiceXY === "X" ? selectedButtonStyle : buttonStyle}
            onClick={() => handleSelect(tagXY, "X")}
          >
            X
          </button>
          <button
            type="button"
            style={choiceXY === "Y" ? selectedButtonStyle : buttonStyle}
            onClick={() => handleSelect(tagXY, "Y")}
          >
            Y
          </button>
        </div>
        <p style={{ fontSize: "11px", color: "#888", marginTop: "10px" }}>
          This updates Choices tags named '<code>{tagAB}</code>' and '<code>{tagXY}</code>'.
        </p>
      </div>
    );
  };

  const [tableData, setTableData] = useState({ headers: [], rows: [] });
  const [classifications, setClassifications] = useState({});
  const [comments, setComments] = useState({});
  const [ratings, setRatings] = useState({}); // New state for star ratings

  // Effect to parse CSV data when the component loads or data changes
  useEffect(() => {
    if (typeof data === "string" && data) {
      const results = simpleCSVParser(data);
      setTableData({ headers: results.headers, rows: results.rows });
    }
  }, [data]);

  // Effect to hydrate component state from saved annotation data
  useEffect(() => {
    // Hydrate classifications from regions
    const initialClassifications = {};
    regions.forEach((region) => {
      const { rowId, classification } = region._value;
      if (rowId !== undefined) {
        initialClassifications[rowId] = classification;
      }
    });
    setClassifications(initialClassifications);

    // Hydrate comments from global state
    if (state?.comments) {
      setComments(state.comments);
    }

    // Hydrate ratings from metadata
    if (metadata) {
      const latestRatings = {};
      metadata.forEach((entry) => {
        if (entry.action === "RATING_SET" && entry.data?.rowId !== undefined) {
          // The last entry in the metadata log for a given row wins
          latestRatings[entry.data.rowId] = entry.data.rating;
        }
      });
      setRatings(latestRatings);
    }
  }, [regions, state, metadata]);

  // Memoize the unique row identifier.
  const getRowId = useMemo(() => {
    return (row, index) => index;
  }, []);

  const handleClassify = (row, index, classification) => {
    const rowId = getRowId(row, index);

    setClassifications((prev) => ({
      ...prev,
      [rowId]: classification,
    }));

    // Find if a region for this row already exists
    const existingRegion = regions.find((r) => r._value.rowId === rowId);

    const regionData = {
      rowId,
      classification,
      rowData: row,
    };

    if (existingRegion) {
      // If the region for this row already exists, just update its value
      // using the new, sanctioned action on the region model.
      existingRegion.updateValue(regionData);
    } else {
      // If this is the first time classifying this row, create a new region.
      addRegion(regionData);
    }
  };

  const handleCommentChange = (row, index, text) => {
    const rowId = getRowId(row, index);
    setComments((prev) => ({
      ...prev,
      [rowId]: text,
    }));
  };

  const handleCommentBlur = (row, index) => {
    const rowId = getRowId(row, index);
    const commentText = comments[rowId] || "";
    const newComments = { ...state.comments };

    if (commentText) {
      newComments[rowId] = commentText;
    } else {
      delete newComments[rowId];
    }

    saveState({
      comments: newComments,
    });
  };

  // New handler for saving star ratings
  const handleRate = (row, index, rating) => {
    const rowId = getRowId(row, index);

    // If the user clicks the same star value again, toggle it off (rate 0)
    const newRating = ratings[rowId] === rating ? 0 : rating;

    setRatings((prev) => ({
      ...prev,
      [rowId]: newRating,
    }));

    // Use the saveMetadata function to log the action
    saveMetadata("RATING_SET", { rowId, rating: newRating });
  };

  if (!data || (tableData.headers.length === 0 && tableData.rows.length === 0)) {
    return <div>No CSV data to display or data is still loading.</div>;
  }

  return (
    <div>
      {/* Add the new Question UI */}
      <QuestionUI getTagValue={getTagValue} setTagValue={setTagValue} />
      <h4>POC Data Classification</h4>
      <table style={tableStyle}>
        <thead>
          <tr>
            {tableData.headers.map((header) => (
              <th key={header} style={thStyle}>
                {header}
              </th>
            ))}
            <th style={thStyle}>Classification</th>
            <th style={thStyle}>Comments</th>
            <th style={thStyle}>Rating</th>
          </tr>
        </thead>
        <tbody>
          {tableData.rows.map((row, index) => {
            const rowId = getRowId(row, index);
            const selectedClass = classifications[rowId];

            return (
              <tr key={rowId}>
                {tableData.headers.map((header) => (
                  <td key={`${rowId}-${header}`} style={tdStyle}>
                    {row[header]}
                  </td>
                ))}
                <td style={tdStyle}>
                  <button
                    type="button"
                    style={selectedClass === "Good" ? selectedButtonStyle : buttonStyle}
                    onClick={() => handleClassify(row, index, "Good")}
                  >
                    Good
                  </button>
                  <button
                    type="button"
                    style={selectedClass === "Bad" ? selectedBadButtonStyle : buttonStyle}
                    onClick={() => handleClassify(row, index, "Bad")}
                  >
                    Bad
                  </button>
                </td>
                <td style={tdStyle}>
                  <textarea
                    style={textareaStyle}
                    value={comments[rowId] || ""}
                    onChange={(e) => handleCommentChange(row, index, e.target.value)}
                    onBlur={() => handleCommentBlur(row, index)}
                    placeholder="Add a comment..."
                  />
                </td>
                <td style={tdStyle}>
                  <StarRating rating={ratings[rowId] || 0} onRate={(newRating) => handleRate(row, index, newRating)} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
