<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!--添加按钮-->
      <el-row>
        <el-col>
          <el-button type="primary" icon="el-icon-add">添加角色</el-button>
        </el-col>
      </el-row>

      <!--表格-->
      <el-table :data="roles" border stripe="">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vertical-center']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!--一级权限-->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <el-col :span="19">
                <!--二级权限-->
                <el-row
                  :class="[i2 === 0 ?'':'bdtop','vertical-center'],"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色说明" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!--编辑-->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
            ></el-button>

            <!--删除-->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
            ></el-button>

            <!--分配权限-->
            <el-tooltip
              effect="dark"
              content="分配权限"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                v-model="scope.row.id"
                size="small"
                @click="showSetRightsDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--分配权限对话框-->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      @close="setRightDialogClosed"
    >
      <el-tree
        :data="rights"
        :default-checked-keys="defaultRightKeys"
        default-expand-all
        show-checkbox
        node-key="id"
        :props="rightTreePorps"
        ref="rightsTreeRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      setRightDialogVisible: false,
      roles: [],
      rights: [],
      rightTreePorps: {
        children: 'children',
        label: 'authName'
      },
      defaultRightKeys: [],
      roleId: -1 // 当授权对话框打开时，保存被点击那一行角色的id，用以后续操作
    }
  },
  created() {
    this.getRoles()
  },
  methods: {
    // 分配权限 确定按钮事件
    async allotRights() {
      const keys = [
        ...this.$refs.rightsTreeRef.getCheckedKeys(),
        ...this.$refs.rightsTreeRef.getHalfCheckedKeys()
      ]
      const ridStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: ridStr
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('权限设置失败')
      }

      this.getRoles()
      this.$message.success('权限设置成功')
      this.setRightDialogVisible = false
    },
    // 权限对话框的关闭事件
    setRightDialogClosed() {
      this.defaultRightKeys = []
      this.roleId = -1
    },
    getLeafKeys(node, arr) {
      // 因为测试接口的数据深度最大为3层，所以第3层的子节点下是没有children数据的。
      // 所以这里判断如果该节点没有children属性，则是第3层，直接把这一层的节点id返回，绑定给树形菜单即可。
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    async showSetRightsDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('权限列表获取失败')
      }
      this.rights = res.data
      this.getLeafKeys(role, this.defaultRightKeys)
      this.setRightDialogVisible = true
    },
    async getRoles() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('角色列表获取失败')
      }
      this.roles = res.data
    },
    async removeRightById(role, right) {
      const confirmResult = await this.$confirm(
        `确认删除【${role.roleName}】的【${right.authName}】权限吗?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.error('取消删除')
      }

      // this.$message.success('删除了')
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${right.id}`
      )

      if (res.meta.status !== 200) {
        return this.$message.error('权限删除失败！')
      }

      role.children = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vertical-center {
  display: flex;
  align-items: center;
}
</style>
