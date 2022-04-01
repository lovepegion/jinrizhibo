import Vue from 'vue'
import 'ant-design-vue/dist/antd.less';
import {
  // Base,
  // Affix,
  // Anchor,
  AutoComplete,
  // Alert,
  // Avatar,
  // BackTop,
  // Badge,
  // Breadcrumb,
  Button,
  // Calendar,
  Card,
  // Collapse,
  Carousel,
  // Cascader,
  Checkbox,
  Col,
  // DatePicker,
  Descriptions,
  Divider,
  Dropdown,
  // Form,
  FormModel,
  Icon,
  Input,
  InputNumber,
  // Layout,
  List,
  // LocaleProvider,
  Menu,
  // Mentions,
  Modal,
  Pagination,
  Popconfirm,
  Popover,
  // Progress,
  Radio,
  // Rate,
  Row,
  Select,
  Slider,
  Spin,
  // Statistic,
  Steps,
  Switch,
  Table,
  // Transfer,
  // Tree,
  // TreeSelect,
  Tabs,
  Tag,
  // TimePicker,
  // Timeline,
  Tooltip,
  Upload,
  // Drawer,
  Skeleton,
  Drawer,
  // Skeleton,
  // Comment,
  // // ColorPicker,
  ConfigProvider,
  Empty,
  // Result,
  // PageHeader,
  // Space,
  message,
  notification,
  // 树形选择
  TreeSelect,
  // 时间选择框
  TimePicker
} from 'ant-design-vue'

Vue.use(AutoComplete)
Vue.use(ConfigProvider)
Vue.use(Row)
Vue.use(Col)
Vue.use(Button)
Vue.use(Menu)
Vue.use(Modal)
Vue.use(Popover)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Divider)
Vue.use(Card)
Vue.use(Spin)
Vue.use(Popconfirm)
Vue.use(Skeleton)
Vue.use(List)
Vue.use(Table)
Vue.use(Table)
Vue.use(Drawer)
Vue.use(Steps)
Vue.use(FormModel)
Vue.use(Select)
Vue.use(Radio)
Vue.use(Descriptions)
Vue.use(Checkbox)
Vue.use(Tooltip)
Vue.use(List)
Vue.use(Empty)
Vue.use(Tag)
Vue.use(Dropdown)
Vue.use(Tabs)
Vue.use(Switch)
Vue.use(Upload)
Vue.use(Icon)
Vue.use(Slider)
Vue.use(Pagination)
Vue.use(Carousel)
Vue.use(TreeSelect)
Vue.use(TimePicker)

Vue.prototype.$message = message;
Vue.prototype.$notification = notification;
Vue.prototype.$info = Modal.info;
Vue.prototype.$success = Modal.success;
Vue.prototype.$error = Modal.error;
Vue.prototype.$warning = Modal.warning;
Vue.prototype.$confirm = Modal.confirm;
// Vue.prototype.$destroyAll = Modal.destroyAll;
