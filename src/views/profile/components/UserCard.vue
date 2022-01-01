<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>个人信息</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="user.avatar" :height="'100px'" :width="'100px'" :hoverable="false">
          <!-- {{ user.role }} -->
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">账号: {{ user.userName }}</div>
        <!-- <div class="user-role text-center text-muted">{{ user.role | uppercaseFirst }}</div> -->
      </div>
    </div>
    <ul>
      <li>客户名称<span>{{ user.name }}</span></li>
      <li>手机号码<span>{{ user.phoneNumber }}</span></li>
      <li>电子邮箱<span>{{ user.email }}</span></li>
      <li>性别<span>{{ user.sex | sexFilter }}</span></li>
      <li>个人简介<span>{{ user.profile }}</span></li>
      <li>创建日期<span>{{ user.createTime }}</span></li>
    </ul>
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'

export default {
  components: { PanThumb },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          phoneNumber: '',
          sex: '',
          avatar: '',
          profile: '',
          userName: '',
          createTime: ''
        }
      }
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

ul{
  list-style: none;
  margin: 36px 0;
  padding: 0;
  li{
    font-size: 13px;
    line-height: 30px;
    border-bottom: 1px solid gainsboro;
    span{
      float: right;
    }
  }
}

</style>
