<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="基本资料" name="account">
                <account :user="user" @getUser="getUser" />
              </el-tab-pane>
              <!-- <el-tab-pane label="基本资料" name="activity">
                <activity />
              </el-tab-pane> -->
              <el-tab-pane label="修改密码" name="timeline">
                <timeline />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Timeline from './components/Timeline'
import Account from './components/Account'

export default {
  name: 'Profile',
  components: { UserCard, Timeline, Account },
  data() {
    return {
      user: {},
      activeTab: 'account'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'userName',
      'email',
      'avatar',
      'phoneNumber',
      'sex',
      'profile',
      'createTime',
      'role'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        userName: this.userName,
        role: this.role,
        email: this.email,
        phoneNumber: this.phoneNumber,
        sex: this.sex,
        avatar: this.avatar,
        profile: this.profile,
        createTime: this.createTime
      }
    }
  }
}
</script>
