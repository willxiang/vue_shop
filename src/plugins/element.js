import Vue from 'vue'
import Timeline from './timeline/index.js'
import TimelineItem from './timeline-item/index.js'
import { 
    Table, 
    TableColumn, 
    Row, 
    Col, 
    Button, 
    Input, 
    Form, 
    FormItem, 
    Message, 
    Container, 
    Header, 
    Aside, 
    Main, 
    Menu, 
    Submenu, 
    MenuItemGroup, 
    MenuItem, 
    Breadcrumb, 
    BreadcrumbItem, 
    Card,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox,
    Tag,
    Tree,
    Select,
    Option,
    TabPane,
    Tabs,
    Alert,
    Cascader
} from 'element-ui'

Vue.use(TimelineItem)
Vue.use(Tabs)
Vue.use(Timeline)
Vue.use(Alert)
Vue.use(Cascader)
Vue.use(TabPane)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Switch)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Button)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
