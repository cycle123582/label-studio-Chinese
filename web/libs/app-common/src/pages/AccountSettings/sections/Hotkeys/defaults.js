export const DEFAULT_HOTKEYS = [
  // Annotation Controls
  {
    id: 100,
    section: "annotation",
    element: "annotation:submit",
    label: "提交标注", // Submit Annotation
    key: "ctrl+enter",
    description: "提交当前标注", // Submit the current annotation
    active: true,
  },
  {
    id: 200,
    section: "annotation",
    element: "annotation:skip",
    label: "跳过任务", // Skip Task
    key: "ctrl+space",
    description: "跳过当前任务", // Skip the current task
    active: true,
  },
  {
    id: 300,
    section: "annotation",
    element: "annotation:undo",
    label: "撤销", // Undo
    key: "ctrl+z",
    description: "撤销上一步操作", // Undo last action
    active: true,
  },
  {
    id: 400,
    section: "annotation",
    element: "annotation:redo",
    label: "重做", // Redo
    key: "ctrl+shift+z",
    description: "重做刚刚撤销的操作", // Redo previously undone action
    active: true,
  },

  // Data Manager
  {
    id: 500,
    section: "data_manager",
    element: "dm.focus-previous",
    label: "聚焦上一个任务", // Focus Previous Task
    key: "shift+up",
    description: "将焦点移动到上一个任务", // Move focus to the previous task
    active: true,
  },
  {
    id: 600,
    section: "data_manager",
    element: "dm.focus-next",
    label: "聚焦下一个任务", // Focus Next Task
    key: "shift+down",
    description: "将焦点移动到下一个任务", // Move focus to the next task
    active: true,
  },
  {
    id: 700,
    section: "data_manager",
    element: "dm.close-labeling",
    label: "聚焦已完成任务", // Focus Closed Task
    key: "shift+left",
    description: "聚焦到已完成任务列", // Focus on the closed task column
    active: true,
  },
  {
    id: 800,
    section: "data_manager",
    element: "dm.open-labeling",
    label: "聚焦未完成任务", // Focus Open Task
    key: "shift+right",
    description: "聚焦到未完成任务列", // Focus on the open task column
    active: true,
  },
  {
    id: 900,
    section: "data_manager",
    element: "dm.toggle-bulk-sidebar-minimization",
    label: "切换批量操作侧边栏", // Toggle Bulk Sidebar
    key: "shift+.",
    description: "最小化或展开批量操作侧边栏", // Minimize or expand bulk actions sidebar
    active: true,
  },

  // Region Management
  {
    id: 1100,
    section: "regions",
    element: "region:delete-all",
    label: "删除所有区域", // Delete All Regions
    key: "ctrl+backspace",
    description: "移除所有区域", // Remove all regions
    active: true,
  },
  {
    id: 1200,
    section: "regions",
    element: "region:focus",
    label: "聚焦第一个区域", // Focus First Region
    key: "enter",
    description: "将焦点移动到第一个可聚焦的区域", // Move focus to the first focusable region
    active: true,
  },
  {
    id: 1300,
    section: "regions",
    element: "region:relation",
    label: "创建区域关系", // Create Region Relation
    key: "alt+r",
    description: "在选定区域之间创建关系", // Create a relation between selected regions
    active: true,
  },
  {
    id: 1400,
    section: "regions",
    element: "region:visibility",
    label: "切换区域可见性", // Toggle Region Visibility
    key: "alt+h",
    description: "显示或隐藏选定的区域", // Show or hide the selected region
    active: true,
  },
  {
    id: 1500,
    section: "regions",
    element: "region:visibility-all",
    label: "切换所有区域可见性", // Toggle All Region Visibility
    key: "ctrl+h",
    description: "显示或隐藏所有区域", // Show or hide all regions
    active: true,
  },
  {
    id: 1600,
    section: "regions",
    element: "region:lock",
    label: "锁定区域", // Lock Region
    key: "alt+l",
    description: "锁定或解锁选定的区域", // Lock or unlock the selected region
    active: true,
  },
  {
    id: 1700,
    section: "regions",
    element: "region:meta",
    label: "编辑区域元数据", // Edit Region Metadata
    key: "alt+m",
    description: "编辑选定区域的元数据", // Edit metadata for selected region
    active: true,
  },
  {
    id: 1800,
    section: "regions",
    element: "region:unselect",
    label: "取消选择区域", // Unselect Region
    key: "u",
    description: "取消选择当前选定的区域", // Deselect the currently selected region
    active: true,
  },
  {
    id: 1900,
    section: "regions",
    element: "region:exit",
    label: "退出区域模式", // Exit Region Mode
    key: "escape",
    description: "退出关系模式并取消选择区域", // Exit relation mode and unselect region
    active: true,
  },
  {
    id: 2000,
    section: "regions",
    element: "region:delete",
    label: "删除选定区域", // Delete Selected Region
    key: "backspace",
    description: "删除当前选定的区域", // Delete currently selected region
    active: true,
  },
  {
    id: 2100,
    section: "regions",
    element: "region:cycle",
    label: "循环切换区域", // Cycle Regions
    key: "alt+.",
    description: "循环切换所有区域", // Cycle through all regions
    active: true,
  },
  {
    id: 2200,
    section: "regions",
    element: "region:duplicate",
    label: "复制区域", // Duplicate Region
    key: "ctrl+d",
    description: "创建选定区域的副本", // Create a copy of the selected region
    active: true,
  },
  {
    id: 2300,
    section: "regions",
    element: "segment:delete",
    label: "删除片段", // Delete Segment
    key: "delete",
    description: "删除选定的片段", // Delete selected segment
    active: true,
  },

  // Editor - Audio Controls
  {
    id: 2400,
    section: "audio",
    element: "audio:back",
    label: "快退 1 秒", // Rewind 1 Second
    key: "ctrl+b",
    description: "音频快退 1 秒", // Rewind the audio by 1 second
    active: true,
  },
  {
    id: 2500,
    section: "audio",
    element: "audio:playpause",
    label: "播放/暂停音频", // Play / Pause Audio
    key: "ctrl+p",
    description: "切换音频播放状态", // Toggle audio playback
    active: true,
  },
  {
    id: 2600,
    section: "audio",
    element: "audio:step-backward",
    label: "后退一步", // Step Back
    key: "alt+a",
    description: "后退一帧", // Step back one frame
    active: true,
  },
  {
    id: 2700,
    section: "audio",
    element: "audio:step-forward",
    label: "前进一步", // Step Forward
    key: "alt+d",
    description: "前进一帧", // Step forward one frame
    active: true,
  },

  // Editor - Video Controls
  {
    id: 2800,
    section: "video",
    element: "media:playpause",
    label: "播放/暂停视频", // Play / Pause Video
    key: "ctrl+alt+space",
    description: "切换视频播放状态", // Toggle video playback
    active: true,
  },
  {
    id: 2900,
    section: "video",
    element: "media:step-backward",
    label: "后退一步", // Step Back
    key: "alt+left",
    description: "后退一帧", // Step one frame backward
    active: true,
  },
  {
    id: 3000,
    section: "video",
    element: "media:step-forward",
    label: "前进一步", // Step Forward
    key: "alt+right",
    description: "前进一帧", // Step one frame forward
    active: true,
  },
  {
    id: 3100,
    section: "video",
    element: "video:keyframe-backward",
    label: "上一关键帧", // Previous Keyframe
    key: "ctrl+alt+left",
    description: "跳转到上一关键帧", // Jump to previous keyframe
    active: true,
  },
  {
    id: 3200,
    section: "video",
    element: "video:keyframe-forward",
    label: "下一关键帧", // Next Keyframe
    key: "ctrl+alt+right",
    description: "跳转到下一关键帧", // Jump to next keyframe
    active: true,
  },
  {
    id: 3300,
    section: "video",
    element: "video:backward",
    label: "快退", // Seek Backward
    key: "alt+left",
    description: "视频快退", // Seek video backward
    active: true,
  },
  {
    id: 3400,
    section: "video",
    element: "video:rewind",
    label: "第一帧", // First Frame
    key: "shift+ctrl+alt+left",
    description: "跳转到第一帧", // Jump to first frame
    active: true,
  },
  {
    id: 3500,
    section: "video",
    element: "video:forward",
    label: "快进", // Seek Forward
    key: "shift+alt+right",
    description: "视频快进", // Seek video forward
    active: true,
  },
  {
    id: 3600,
    section: "video",
    element: "video:fastforward",
    label: "最后一帧", // Last Frame
    key: "shift+ctrl+alt+right",
    description: "跳转到最后一帧", // Jump to last frame
    active: true,
  },
  {
    id: 3700,
    section: "video",
    element: "video:hop-backward",
    label: "快速后退", // Hop Backward
    key: "shift+alt+left",
    description: "快速向后跳跃", // Hop backward quickly
    active: true,
  },
  {
    id: 3800,
    section: "video",
    element: "video:hop-forward",
    label: "快速前进", // Hop Forward
    key: "shift+alt+right",
    description: "快速向前跳跃", // Hop forward quickly
    active: true,
  },

  // Editor - Time Series Controls
  {
    id: 3900,
    section: "timeseries",
    element: "ts:grow-left",
    label: "向左扩展", // Extend Left
    key: "left",
    description: "向左扩展区域", // Extend the region to the left
    active: true,
  },
  {
    id: 4000,
    section: "timeseries",
    element: "ts:grow-right",
    label: "向右扩展", // Extend Right
    key: "right",
    description: "向右扩展区域", // Extend the region to the right
    active: true,
  },
  {
    id: 4100,
    section: "timeseries",
    element: "ts:shrink-left",
    label: "左侧收缩", // Shrink Left
    key: "alt+left",
    description: "从左侧收缩区域", // Shrink the region from the left
    active: true,
  },
  {
    id: 4200,
    section: "timeseries",
    element: "ts:shrink-right",
    label: "右侧收缩", // Shrink Right
    key: "alt+right",
    description: "从右侧收缩区域", // Shrink the region from the right
    active: true,
  },
  {
    id: 4300,
    section: "timeseries",
    element: "ts:grow-left-large",
    label: "向左大幅扩展", // Extend Left (Large)
    key: "shift+left",
    description: "向左大幅扩展区域", // Extend region left significantly
    active: true,
  },
  {
    id: 4400,
    section: "timeseries",
    element: "ts:grow-right-large",
    label: "向右大幅扩展", // Extend Right (Large)
    key: "shift+right",
    description: "向右大幅扩展区域", // Extend region right significantly
    active: true,
  },
  {
    id: 4500,
    section: "timeseries",
    element: "ts:shrink-left-large",
    label: "左侧大幅收缩", // Shrink Left (Large)
    key: "shift+alt+left",
    description: "从左侧大幅收缩区域", // Shrink region from left significantly
    active: true,
  },
  {
    id: 4600,
    section: "timeseries",
    element: "ts:shrink-right-large",
    label: "右侧大幅收缩", // Shrink Right (Large)
    key: "shift+alt+right",
    description: "从右侧大幅收缩区域", // Shrink region from right significantly
    active: true,
  },

  // Image Gallery Controls
  {
    id: 4700,
    section: "image_gallery",
    element: "image:prev",
    label: "上一张图片", // Previous Image
    key: "ctrl+left",
    description: "查看上一张图片", // View previous image
    active: true,
  },
  {
    id: 4800,
    section: "image_gallery",
    element: "image:next",
    label: "下一张图片", // Next Image
    key: "ctrl+right",
    description: "查看下一张图片", // View next image
    active: true,
  },

  {
    id: 5000,
    section: "tools",
    element: "tool:zoom-in",
    label: "放大", // Zoom In
    key: "ctrl+plus",
    description: "放大图片", // Zoom in on the image
    active: true,
  },
  {
    id: 5100,
    section: "tools",
    element: "tool:pan-image",
    label: "平移图片", // Pan Image
    key: "H",
    description: "平移浏览图片", // Pan around the image
    active: true,
  },
  {
    id: 5200,
    section: "tools",
    element: "tool:zoom-to-fit",
    label: "缩放至适应", // Zoom to Fit
    key: "shift+1",
    description: "缩放至适应视图", // Zoom to fit the full image in view
    active: true,
  },
  {
    id: 5300,
    section: "tools",
    element: "tool:zoom-to-actual",
    label: "缩放至 100%", // Zoom to 100%
    key: "shift+2",
    description: "缩放至实际大小 (100%)", // Zoom to actual image size (100%)
    active: true,
  },
  {
    id: 5400,
    section: "tools",
    element: "tool:zoom-out",
    label: "缩小", // Zoom Out
    key: "ctrl+minus",
    description: "缩小图片", // Zoom out of the image
    active: true,
  },
  {
    id: 5401,
    section: "tools",
    element: "tool:move",
    label: "移动工具", // Move Tool
    key: "V",
    description: "选择移动工具以重新定位标注", // Select the move tool to reposition annotations
    active: true,
  },
  {
    id: 5402,
    section: "tools",
    element: "tool:brush",
    label: "笔刷工具", // Brush Tool
    key: "B",
    description: "选择笔刷工具", // Select the brush tool
    active: true,
  },

  {
    id: 5500,
    section: "tools",
    element: "tool:ellipse",
    label: "椭圆工具", // Ellipse Tool
    key: "O",
    description: "选择椭圆工具", // Select the ellipse tool
    active: true,
  },
  {
    id: 5600,
    section: "tools",
    element: "tool:eraser",
    label: "橡皮擦工具", // Eraser Tool
    key: "E",
    description: "选择橡皮擦工具", // Select the eraser tool
    active: true,
  },
  {
    id: 5700,
    section: "tools",
    element: "tool:auto-detect",
    label: "自动检测", // Auto Detect
    key: "M",
    description: "使用自动检测工具自动建议区域", // Use the auto-detect tool to automatically suggest regions
    active: true,
  },
  {
    id: 5900,
    section: "tools",
    element: "tool:key-point",
    label: "关键点工具", // Key Point Tool
    key: "K",
    description: "选择关键点标注工具", // Select the key point annotation tool
    active: true,
  },
  {
    id: 6000,
    section: "tools",
    element: "tool:magic-wand",
    label: "魔棒工具", // Magic Wand
    key: "W",
    description: "选择魔棒工具进行智能区域选择", // Select the magic wand tool for smart region selection
    active: true,
  },
  {
    id: 6100,
    section: "tools",
    element: "tool:polygon",
    label: "多边形工具", // Polygon Tool
    key: "P",
    description: "选择多边形标注工具", // Select the polygon annotation tool
    active: true,
  },
  {
    id: 6200,
    section: "tools",
    element: "tool:rect",
    label: "矩形工具", // Rectangle Tool
    key: "R",
    description: "选择矩形标注工具", // Select the rectangle annotation tool
    active: true,
  },
  {
    id: 6201,
    section: "tools",
    element: "tool:rect-3point",
    label: "三点矩形工具", // 3-Point Rectangle
    key: "shift+R",
    description: "使用三点选择绘制旋转矩形", // Draw a rotated rectangle using 3-point selection
    active: true,
  },

  {
    id: 6300,
    section: "tools",
    element: "tool:rotate-left",
    label: "向左旋转", // Rotate Left
    key: "alt+left",
    description: "向左旋转图片 90°", // Rotate the image 90° to the left
    active: true,
  },
  {
    id: 6400,
    section: "tools",
    element: "tool:rotate-right",
    label: "向右旋转", // Rotate Right
    key: "alt+right",
    description: "向右旋转图片 90°", // Rotate the image 90° to the right
    active: true,
  },
  {
    id: 6700,
    section: "tools",
    element: "tool:decrease-tool",
    label: "减小工具尺寸", // Decrease Tool Size
    key: "[",
    description: "减小工具尺寸", // Decrease tool size
    active: true,
  },
  {
    id: 6800,
    section: "tools",
    element: "tool:increase-tool",
    label: "增大工具尺寸", // Increase Tool Size
    key: "]",
    description: "增大工具尺寸", // Increase tool size
    active: true,
  },

  // Paragraph Navigation
  {
    id: 6900,
    section: "paragraphs",
    element: "phrases:next-phrase",
    label: "下一个短语", // Next Phrase
    key: "ctrl+down",
    description: "在段落视图中导航到下一个短语", // Navigate to the next phrase in paragraph view
    active: true,
  },
  {
    id: 7000,
    section: "paragraphs",
    element: "phrases:previous-phrase",
    label: "上一个短语", // Previous Phrase
    key: "ctrl+up",
    description: "在段落视图中导航到上一个短语", // Navigate to the previous phrase in paragraph view
    active: true,
  },
  {
    id: 7100,
    section: "paragraphs",
    element: "phrases:select_all_annotate",
    label: "全选并标注", // Select All and Annotate
    key: "ctrl+shift+a",
    description: "选择当前短语中的所有文本并创建标注", // Select all text in current phrase and create annotation
    active: true,
  },
  {
    id: 7200,
    section: "paragraphs",
    element: "phrases:next-region",
    label: "短语内下一区域", // Next Region in Phrase
    key: "ctrl+right",
    description: "导航到当前短语内的下一个区域", // Navigate to the next region within current phrase
    active: true,
  },
  {
    id: 7300,
    section: "paragraphs",
    element: "phrases:previous-region",
    label: "短语内上一区域", // Previous Region in Phrase
    key: "ctrl+left",
    description: "导航到当前短语内的上一个区域", // Navigate to the previous region within current phrase
    active: true,
  },
];

export const HOTKEY_SECTIONS = [
  {
    id: "annotation",
    title: "标注操作", // Annotation Actions
    description: "常用标注任务的快捷键，如提交、跳过、撤销和重做", // Shortcuts for common annotation tasks...
  },

  {
    id: "data_manager",
    title: "数据管理器", // Data Manager
    description: "在项目数据管理器中导航和管理任务的快捷键", // Shortcuts for navigating and managing tasks...
  },

  {
    id: "regions",
    title: "区域管理", // Region Management
    description: "创建、选择和操作标注区域的快捷键", // Shortcuts for creating, selecting and manipulating annotation regions
  },

  {
    id: "tools",
    title: "工具", // Tools
    description: "在标注图像时控制工具栏的快捷键", // Shortcuts for controlling tools panel when labeling images
  },

  {
    id: "audio",
    title: "音频控制", // Audio Controls
    description: "控制音频播放和导航的快捷键", // Shortcuts for controlling audio playback and navigation
  },
  {
    id: "video",
    title: "视频控制", // Video Controls
    description: "控制视频播放和导航的快捷键", // Shortcuts for controlling video playback and navigation
  },
  {
    id: "timeseries",
    title: "时间序列控制", // Time Series Controls
    description: "操作时间序列数据区域的快捷键", // Shortcuts for manipulating time series data regions
  },
  {
    id: "image_gallery",
    title: "图像库导航", // Image Gallery Navigation
    description: "在多图任务中图像之间导航的快捷键", // Shortcuts for navigating between images in multi-image tasks
  },
  {
    id: "paragraphs",
    title: "段落导航", // Paragraph Navigation
    description: "在段落/对话视图中导航短语和区域的快捷键", // Shortcuts for navigating phrases and regions in paragraph/dialogue view
  },
];

/**
 * URL patterns mapped to their corresponding hotkey sections
 * Used to automatically determine which shortcuts to display based on current page
 */
export const URL_TO_SECTION_MAPPING = [
  {
    regex: /\/projects\/\d+\/data\/?\?.*task=\d+/i,
    section: ["annotation", "regions"],
  },
  {
    regex: /\/projects\/\d+\/data\/?$/i,
    section: "data_manager",
  },
];
