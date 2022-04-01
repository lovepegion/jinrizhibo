<template>
  <div class="works-make">
    <!-- 制作视频主表单 -->
    <div class="works-make-box" v-show="mode === 1">
      <h1>制作视频</h1>
      <ul class="work-navs">
        <li class="nav-item nav-item-active">
          <a-button type="primary" @click="toSetting">
            作品设置
          </a-button>
        </li>
        <!-- <a-tooltip placement="bottomLeft">
          <template slot="title">
            <p>支持语种：【普通话】、【英语】、【台湾话】、【东北话】、【四川话】、【陕西话】、【广东话】、【湖南话】、【河南话】、【山东话】、【湖北话】、【安徽合肥话】、【内蒙古方言】、【德语】、【法语】、【印地语】、【意大利语】、【日语】、【韩语】、【西班牙语】、【俄语】、【泰语】</p>
            <p>请按以下格式，在每个语种文本开头，添加多语种标签【】</p>
            <p>示例：【普通话】大家好，我是人工智能虚拟主播。【英语】I am the virtual host of artificial intelligence.</p>
            <p>说明：格式不正确、标记错误，会导致无法正常试听与合成。</p>
          </template>
          <li class="nav-item">
            <div class="plus0_wrap">
              <span class="plus0_1_choose">选择语言</span>
              <ul class="plus0_1_list">
                <li v-for="(item,index) in langs" class="plus0_1_list_item" :key="index">
                  <input type="checkbox" :value="item" v-model="selectedLangs">&nbsp;&nbsp;<span>{{item}}</span>
                </li>
              </ul>
            </div>
          </li>
        </a-tooltip> -->
        <li class="nav-item">
          <a-upload :showUploadList="false" :before-upload="beforeUpload" :custom-request="handParseDoc" accept=".txt, .docx, .doc">
            <a-button>
              导入文本
            </a-button>
          </a-upload>
        </li>
        <!-- plus0_语言选择 -->
        <li class="plus0_langchoose">
          <Langdrop @getSelectedLangs="getSelectedLangs"></Langdrop>
        </li>
        <li class="nav-tip">最多选择3种语言，内容支持txt、doc、docx格式的批量上传</li>
        <!-- <li style="marginLeft: 10px;fontSize:14px">已选择语言：{{selectedLangs}}</li> -->
      </ul>
      <div class="work-body">
        <!-- plus1_语言文字输入 -->
        <div class="plus1_text">
          <!-- plus1_0_主语言placeholder -->
          <div v-if="textLangs[0] && !editor" class="plus1_mainholder">{{textLangs[0].lang}}文本：请输入{{textLangs[0].lang}}文本，否则会导致无法正常试听与合成</div>
          <!-- plus1_1主语言的文字 -->
          <div class="work-body-editor" x>
            <quill-editor
              ref="myQuillEditor"
              v-model="editor"
              :options="editorOption"
              @focus="onFocus"
              @change="onEditorChange($event)"
              class="editor"
            />
            <div class="editor-footer">
              <div class="footer-box">
                <div class="arrow-item" @click="setSelectionFront"><a-icon type="left" />回到顶部</div>
                <div class="arrow-item" @click="setSelectionEnd" style="margin: 0 20px 0 10px;"><a-icon type="right" />回到底部</div>
                <div>{{ TiLength }}/2000</div>
              </div>
            </div>
          </div>
          <!-- plus1_2次语言的文字 -->
          <div class="work-body-editor" v-for="item in textLangs.slice(1)" :key="item.lang">
            <div v-if="textLangs.length>1">
              <!-- <quill-editor
                v-model="item.content"
                :options="{placeholder: item.lang+'文本：请输入'+item.lang+'文本，否则会导致无法正常试听与合成', modules: {toolbar: '#toolbar'}}"
                class="editor"
              /> -->
              <textarea
                class="plus1_2_otherlang"
                maxlength="2000"
                cols="78"
                rows="22"
                v-model="item.content"
                :placeholder="item.lang+'文本：请输入'+item.lang+'文本，否则会导致无法正常试听与合成'"
              ></textarea>
              <div class="editor-footer">
                <div class="footer-box">
                  <!-- <div class="arrow-item" @click="setSelectionFront"><a-icon type="left" />回到顶部</div>
                  <div class="arrow-item" @click="setSelectionEnd" style="margin: 0 20px 0 10px;"><a-icon type="right" />回到底部</div> -->
                  <div>{{ item.content.length }}/2000</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="work-body-config">
          <h2>视频设置：</h2>
          <a-form-model class="config-form" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" labelAlign="left">
            <a-form-model-item label="朗诵语速">
              <a-slider v-model="form.speed" :default-value="8" :min="0" :max="100" />
            </a-form-model-item>
            <a-form-model-item label="音乐音量">
              <a-slider v-model="form.volume" :default-value="8" :min="0" :max="100" />
            </a-form-model-item>
            <a-form-model-item label="插入停顿">
              <ul class="insert-pause">
                <li class="item" @click="insertTag('连续')">连续</li>
                <li class="item" @click="insertTag('0.5s')">0.5s</li>
                <li class="item" @click="insertTag('1s')">1s</li>
                <li class="item" @click="insertTag('2s')">2s</li>
              </ul>
            </a-form-model-item>
            <a-form-model-item label="主播形象">
              <div class="anchor-config">
                <div class="anchor-config-left">
                  <img :src="anchorSetting ? anchorSetting.curSelectAnchor : anchor0" alt="">
                  <span style="color: #666666; margin-left: 10px;">{{ anchorSetting ? anchorSetting.curSelectAnchorText : '小璇' }}/中立</span>
                </div>
                <a @click="changeAnchor">更换</a>
              </div>
            </a-form-model-item>
            <!-- <a-form-model-item label="背景音乐">
              <div class="anchor-config">
                <div class="anchor-config-left">
                  <img :src="music" alt="" style="border-radius: 0; width: 20px; height: 20px;">
                  <span style="color: #666666; margin-left: 10px;">再回眸-指尖笑</span>
                </div>
                <a>更换</a>
              </div>
            </a-form-model-item> -->
          </a-form-model>
          <div class="form-btn">
            <!-- plus第二期增加语言选择 -->
            <div>
              <a-button type="primary" :loading="loadingAudio" @click="handleAudio" v-if="audioPlay === 0">
                配音试听
              </a-button>
              <a-button type="primary" @click="stopAudio" v-if="audioPlay === 1">
                停止播放
              </a-button>
              <br>
              <!-- plus_语音选择列表 -->
              <select class="plus_selectList" v-model="testLang">
                <option value="">试听语言</option>
                <option v-for="(item,index) in selectedLangs" :key="index" :value="item">{{item}}</option>
              </select>
            </div>
            <a-button @click="showSubmit">
              制作视频
            </a-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 作品设置表单 -->
    <setting ref="setting" v-show="mode === 2" :init-form="setting" @saveBack="settingBack"></setting>
    <!-- 预览视频表单 -->
    <div class="works-preview-box" v-show="mode === 3">
      <h1>视频预览</h1>
      <a-form-model ref="rulePreviewForm" class="config-form" :model="formPreview" labelAlign="left" :rules="previewRules" :hideRequiredMark="true">
        <div class="preview-title">
          <a-form-model-item label="作品标题" :labelCol="{span: 4}" :wrapperCol="{span: 12}" prop="title">
            <a-input v-model="formPreview.title" placeholder="请输入作品名称" />
          </a-form-model-item>
        </div>
        <div class="preview-body">
          <div class="preview-left">
            <!-- <a-form-model-item label="作品内容" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
              <quill-editor
                ref="myPreiviewQuillEditor"
                :options="editorOption"
                class="editor"
              />
            </a-form-model-item> -->
            <!-- plus_作品预览内容调整 -->
            <div class="plus_precontent_wrap">
              <b>作品内容</b>
              <textarea class="plus_precontent" cols="65" rows="7" v-model="pretext" disabled></textarea>
            </div>
            <!-- plus_视频/频道显示/简介/语言切换 -->
            <div class="plus_video_channel_des">
              <!-- plus_原视频 -->
              <video
                ref="headVideo"
                v-show="headVideoUrl"
                controls
                disablePictureInPicture
                controlsList="nodownload noremoteplayback"
                :src="headVideoUrl"
                style="height: 340px;"
              />
              <!-- plus_原视频 -->
              <video
                ref="previewVideo"
                v-show="showPreVideo"
                controls
                disablePictureInPicture
                controlsList="nodownload noremoteplayback"
                :src="switchedLangUrl || previewVideo"
                style="height: 340px;"
              />
              <!-- plus_插播的视频 -->
              <video
                ref="insertVideo"
                v-show="showInsertVideo"
                controls
                disablePictureInPicture
                controlsList="nodownload noremoteplayback"
                :src="inSertUrl"
                style="height: 340px;"
              />
              <!-- plus_左上角logo及公司名称 -->
              <!-- <div class="plus_logo_company">
                <div class="plus_lefttop_logo" v-if="choosedCompany">
                  <img :src="'@/assets/image/'+choosedCompany+'.png'">
                </div>
                <div v-if="choosedCompany" class="plus_lefttop_company">
                  {{choosedCompany}}
                </div>
              </div> -->
              <div class="plus_logo_company">
              <!-- plus_左上角logo -->
                <div class="plus_lefttop_logo">
                  <img v-if="choosedCompany" :src="require('@/assets/image/'+choosedCompany.trim()+'.png')">
                  <img v-else-if="userInfo.company" :src="require('@/assets/image/'+userInfo.company.trim()+'.png')">
                  <!-- <img v-else :src="require('@/assets/image/'+detail.channelName.trim()+'.png') || ''"> -->
                  <div v-if="choosedCompany && choosedCompany != '合肥柯锐'" class="plus_lefttop_company">{{choosedCompany}}</div>
                  <div v-else-if="userInfo.company && userInfo.company != '合肥柯锐'" class="plus_lefttop_company">{{userInfo.company}}</div>
                </div>
              <!-- plus_logo下的公司名 -->
              </div>
              <!-- plus_语言切换 -->
              <!-- <div class="plus_langChoose" v-if="selectedLangs.length > 1">
                <select class="plus_langChoose_item" v-model="switchedIndex" @change="onSwitch()">
                  <option value='' disabled selected>语言切换</option>
                  <option v-for="(item, index) in selectedLangs" :key="index" :value="index">{{item}}</option>
                </select>
              </div> -->
              <div class="plus_langChoose" v-if="showChangeLang && selectedLangs.length > 1">
                <ul class="plus_langChooseItem">
                  <li v-for="(item, index) in selectedLangs" :key="index" :value="index" @click="onSwitch(index)" class="plus_langChooseItem_item" :class="{plus_langChooseItem_active:switchedIndex===index}">{{item}}</li>
                </ul>
              </div>
              <!-- plus_底部视频简介 -->
              <div class="plus_des_wrap" v-if="secondTitle && showSecondTitle">
                <div class="plus_des_main" v-if="secondTitle">{{secondTitle}}</div>
                <div class="plus_des_detail" v-if="productDes">{{productDes}}</div>
              </div>
            </div>
          </div>
          <div class="preview-right">
            <h2>合成设置：</h2>
            <div style="textAlign:left;marginBottom:10px"><strong>已选择语言</strong>：{{this.selectedLangs}}</div>
            <!-- plus_频道及公司选择 -->
            <div class="plus_channel_company">
              <!-- plus_主频道选择 -->
              <a-form-model-item label="栏目选择" :labelCol="{span: 4}" :wrapperCol="{span: 10}" prop="channel">
                <div class="plus_channelwrap">
                  <div>
                    <!-- <a-select v-model="formPreview.channel" style="width: 130px" @change="onSelectChange"> -->
                    <a-select style="width: 130px">
                      <a-select-option v-for="item in channelOptions.slice(1)" :key="item.id" :value="item.id" @click="onSelectChange(item.name, item.id)">{{ item.name }}</a-select-option>
                    </a-select>
                    <template slot="extra">
                      <div class="extra-tips">场景制作需要管理员审核</div>
                    </template>
                  </div>
                  <!-- plus_公司选择 -->
                  <a-select
                    v-if="formPreview.channel==='ea43393fdec54c6d92cd55a843cf05f5' || formPreview.channel==='54f28e4ec1ce44cdb5dfc9b3ef747f88'"
                    show-search
                    placeholder="单位"
                    style="width: 120px; marginLeft:5px"
                    @change="handleChange"
                  >
                    <a-select-option v-for="item in companies" :key="item.id" :value="item.company">{{item.company}}</a-select-option>
                  </a-select>
                </div>
              </a-form-model-item>

            </div>
            <!-- plus自定义标题 -->
            <div style="textAlign:left">
              <strong>内容提要: </strong>
              <input type="text" placeholder="输入内容提要" v-model="secondTitle" style="marginLeft:15px;border:none;width:240px;padding:4px;outline:none">
            </div>
            <!-- plus自定义描述 -->
            <div class="plus_myDes">
              <strong style="fontSize:14px;marginRight:18px;">作品简介: </strong>
              <textarea cols="35" rows="2" style="border:none;outline:none;resize:none;padding:7px" placeholder="输入作品简介" v-model="productDes"></textarea>
            </div>
            <!-- plus插入片头 -->
            <div style="textAlign:left;marginTop:15px">
              <strong style="marginRight:10px">是否插入片头: </strong>
              <label style="marginRight:10px"><input type="radio" v-model="isHeadVideo" value="yes">是</label>
              <label style="marginRight:10px"><input type="radio" v-model="isHeadVideo" value="no" @click="cancelHead">否</label>
              <!-- plus片头插入进度显示 -->
              <a-button type="primary" :loading="headloading" v-if="headloading" style="zIndex:1">{{ '上传中,稍后...' }}</a-button>
            </div>
            <!-- plus片头插入框 -->
            <div class="plus_insertbox" v-if="isHeadVideo==='yes'">
              <div class="plus_insertbox_insertRef">
                <input type="file" accept="video/*" style="width:180px" @change="onHead" ref="headFile">
              </div>
            </div>
            <!-- plus插入视频 -->
            <div style="textAlign:left;marginTop:15px">
              <strong style="marginRight:10px">是否插入视频: </strong>
              <label style="marginRight:10px"><input type="radio" v-model="isInsertVideo" value="yes">是</label>
              <label style="marginRight:10px"><input type="radio" v-model="isInsertVideo" value="no" @click="cancelInsert">否</label>
              <!-- plus视频插入进度显示 -->
              <a-button type="primary" :loading="insertloading" v-if="insertloading" style="zIndex:1">{{ '上传中,稍后...' }}</a-button>
            </div>
            <!-- plus视频插入框 -->
            <div class="plus_insertbox" v-if="isInsertVideo==='yes'">
              <div class="plus_insertbox_insertRef">
                <input type="file" accept="video/*" style="width:180px" @change="onInsert" ref="insertFile">
              </div>
              <select class="plus_insertbox_select" style="width:80px" v-model="insertPos" @change="onInsertPos">
                <option value="">插入位置</option>
                <option value="开始">开始</option>
                <option value="中间">中间</option>
                <option value="结尾">结尾</option>
                <option value="自定义">自定义</option>
              </select>
              <!-- plus自定义时间 -->
              <div v-if="showInsertDiy" class="plus_timediy">
                <a-time-picker :default-open-value="moment('00:00', 'mm:ss')" format="mm:ss" @change="onInsertTime" style="width: 100px" placeholder="选择时间" />
              </div>
            </div>
            <!-- plus插入logo -->
            <!-- <div style="textAlign:left;marginTop:15px">
              <strong style="marginRight:10px">插入视频logo: </strong>
              <label style="marginRight:10px"><input type="radio" v-model="isInsertLogo" value="yes">是</label>
              <label style="marginRight:10px"><input type="radio" v-model="isInsertLogo" value="no" @click="cancelLogo">否</label>
            </div> -->
            <!-- plus_logo插入框 -->
            <div class="plus_logobox" v-if="isInsertLogo==='yes'">
              <input type="file" accept="image/*" style="width:180px" @change="onInsertLogo" ref="insertLogo">
            </div>

            <a-form-model-item label="封面设置" :labelCol="{span: 6}" :wrapperCol="{span: 18}">
              <a-radio-group v-model="formPreview.coverNumber" @change="handleCoverNumberChange">
                <a-radio :value="1">
                  单图
                </a-radio>
                <a-radio :value="3">
                  三图
                </a-radio>
                <!-- <a-radio :value="0">
                  无封面
                </a-radio> -->
              </a-radio-group>
              <a-upload
                name="file"
                :file-list="coverFileList"
                :multiple="formPreview.coverNumber === 3"
                class="cover-upload"
                accept="image/png, image/jpeg"
                v-if="formPreview.coverNumber !== 0"
                :remove="handleCoverRemove"
                :before-upload="beforeCoverUpload"
              >
                <div class="cover-upload-body">
                  <a-icon type="camera" style="font-size: 30px; margin-bottom: 8px;" />
                  <p>点击上传图片</p>
                </div>
              </a-upload>
              <template slot="extra">
                <div v-if="formPreview.coverNumber !== 0" class="extra-tips">优质的封面有利于推荐，格式支持JPEG、PNG</div>
              </template>
            </a-form-model-item>
            <a-form-model-item label="公开设置" :labelCol="{span: 6}" :wrapperCol="{span: 18}">
              <a-switch v-model="formPreview.type" />
            </a-form-model-item>
            <a-form-model-item label="转载来源" :labelCol="{span: 6}" :wrapperCol="{span: 18}">
              <a-input v-model="formPreview.source" placeholder="请输入转载来源" />
            </a-form-model-item>
            <div style="margin-top: 30px;">
              <a-button type="primary" style="margin-right: 20px;" @click="_sendProduct" :loading="sendProductloading">
                {{ sendProductloading ? '作品发布中' : '发布作品' }}
              </a-button>
              <a-button @click="showSubmit">
                取消
              </a-button>
            </div>
          </div>
        </div>
      </a-form-model>
    </div>
    <!-- 子组件 -->
    <music-modal ref="musicModal" />
    <anchor-modal ref="anchorModal" :init-form="anchorSetting" @saveBack="anchorBack" />
    <!-- 弹窗 -->
    <a-modal v-model="submitVisible" title="制作视频" on-ok="handleOk" class="make-modal" :width="463" :maskClosable="false" :afterClose="cancelToPreview" >
      <template slot="footer">
        <div class="modal-footer">
          <a-button key="submit" type="primary" :loading="makeVideoloading" @click="saveToPreview">
            {{ makeVideoloading ? '视频制作中，请稍候...' : '保存' }}
          </a-button>
          <a-button key="back" @click="cancelToPreview">
            取消
          </a-button>
        </div>
      </template>
      <p class="title">作品名称</p>
      <a-form-model ref="ruleProjectForm" class="config-form" :model="formPreview" :rules="previewRules" :hideRequiredMark="true">
        <a-form-model-item label="" prop="title">
          <a-input v-model="formPreview.title" placeholder="请输入作品名称" style="margin-bottom: 10px;" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <div id="toolbar">
      <!-- But you can also add your own -->
      <button id="custom-button"></button>
    </div>
  </div>
</template>

<script>
// import subChannel1 from '@/assets/image/subChannel1.png'
import { mapState } from 'vuex'
import mammoth from 'mammoth'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { Quill, quillEditor } from 'vue-quill-editor'
import anchor0 from '@/assets/image/anchor0.png'
import music from '@/assets/icon/music.png'
import setting from './setting.vue'
import anchorModal from './modal/anchor.vue'
import musicModal from './modal/music.vue'
import { add, getTaskResult, getAllChannel, sendProduct, getAudio, getChannelCompany } from '@/api/make'
import { parseDoc, upload } from '@/api/file'
import calcText from '@/utils/lang'
import Langdrop from './components/langdrop.vue'
import moment from 'moment';
import { imageToBase64, base64ToFile } from '@/utils/imgfile.js' // 图片转file类型
/* eslint-disable */
const reg1= / 连续 /g
const reg2= / 0.5s /g
const reg3= / 1s /g
const reg4= / 2s /g

let Inline = Quill.import('blots/inline')
class Tag extends Inline {
  static create(value) {
    let node = super.create(value)
    if (value) {
      node.setAttribute('class', value)
    }
    return node
  }
  static formats(domNode) {
    return domNode.getAttribute("class")
  }
  format(name, value) {
    if (name !== this.statics.blotName || !value) return super.format(name, value)
    if (value){
      this.domNode.setAttribute('class', value)
    }
  }
}
Tag.blotName = 'tag'
Tag.tagName = 'span'
Quill.register(Tag)
const BackgroundClass = Quill.import('attributors/class/background')
const ColorClass = Quill.import('attributors/class/color')
const SizeStyle = Quill.import('attributors/style/size')
Quill.register(BackgroundClass, true)
Quill.register(ColorClass, true)
Quill.register(SizeStyle, true)

export default {
  name: 'Make',
  components: {
    quillEditor,
    setting,
    anchorModal,
    musicModal,
    Langdrop
  },
  data() {
    return {
      langs: [ // 语言种类列表
        '普通话', '英语', '台湾话', '东北话', '四川话', '陕西话', '广东话', '湖南话', 
        '河南话', '山东话', '湖北话', '安徽合肥话', '内蒙古方言', '德语', '法语', '印地语', 
        '意大利语', '日语', '韩语', '西班牙语', '俄语', '泰语'
      ], 
      selectedLangs: [], // 选择的语言种类列表，不超过种
      chineseLangs: ['普通话', '台湾话', '东北话', '四川话', '陕西话', '广东话', '湖南话', '河南话', '山东话', '湖北话', '安徽合肥话', '内蒙古方言'], // 中文地方语言
      textLangs: [], // 需要输入文本的语言
      changOrderLangs: [], // 改变语言顺序，主语言用原来的代码最最后一次请求
      testLang: '', // 配音试听语言
      showChangeLang: true,
      showSecondTitle: true,
      secondTitle: '', // 自定义二级标题
      choosedChannel: '', // 选择的频道名称
      isHeadVideo: 'no', // 是否插入片头
      headVideoUrl: '', // 插入片头url
      headPlayUrl: '', // 插入片头的线上播放地址
      headloading: false, // 片头插入进度
      isInsertVideo: 'no', // 是否插入视频
      isInsertLogo: 'no', // 是否插入logo
      insertlogoUrl: '', // 插入logo生成的url
      productDes: '', // 视频简介
      videoUrls: [], // 次语种视频的Url
      inSertUrl: '', // 插入视频的Url
      insertPos: '', // 插入位置
      insertSeconds: '', // 自定义插入位置的秒数
      insertDiy: '1', // 自定义显示的位置，只作为显示
      showInsertDiy: false, // 是否显示自定义插入时间
      insertPlayUrl: '', // 插入视频的线上播放地址
      switchedLangUrl: '', // 切换语言视频Url
      switchedIndex: '', // 切换语言的索引
      showPreVideo: true, // 展示原视频
      showInsertVideo: false, // 展示插入视频
      insertloading: false, // 视频插入进度
      companies: [], // 选择的公司列表
      choosedCompany: '', // 选择的公司
      haslogo: false, // 是否加入了logo
      imgFileData: '', // img图片的file类型数据
      mode: 1,
      anchor0,
      music,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      editor: '', // 主语言文本含html格式
      maincontent: '', // 不含html格式的主语言文本，输入时候的第一项
      pretext: '', // 预览时显示的文本内容
      editorOption: {
        placeholder: '         请输入需要配音的文本，格式参照作品内容',
        modules: {
          toolbar: '#toolbar'
        }
      },
      TiLength: 0,
      rangeIndex: 0,
      form: {
        speed: 50,
        volume: 100,
        videoContent: '',
      },
      formPreview: {
        title: '',
        channel: '',
        coverNumber: 1,
        type: true,
      },
      previewRules: {
        title: [
          { required: true, message: '作品标题不能为空！', trigger: 'blur' },
        ],
        channel: [
          { required: true, message: '栏目不能为空！', trigger: 'blur' },
        ],
      },
      musicFileList: [],
      channelOptions: [],
      submitVisible: false,
      musicVisible: false,
      taskIds: [], // 作品序号
      previewVideo: null, // 主语言视频URL
      coverFileList: [],
      sendProductloading: false,
      makeVideoloading: false,
      makeVideoTimer: null,
      setting: {
        format: 'mp4',
        ratio: '1080',
        quality: 0,
        subtitles: 1,
      },
      anchorSetting: null,
      audioObj: null,
      loadingAudio: false,  //  音频获取中
      calcedText: [],
      audioSrcArr: [],
      audioFlag: false,
      audioSrc: '', //  音频试听url
      audioPlay: 0, //  音频播放状态：0：初始状态，1：播放中
      importTextFile: null,
      uploadDocFile: null,
      timer: '',
      cursorText: '',
    }
  },
  computed: {
		...mapState(['userInfo'])
	},
  watch: {
    /* selectedLangs (newVal) {
      if (newVal.length > 3) {
        this.$nextTick(() => {
          this.selectedLangs.pop()
        })
      }
    } */
    editor (newVal) {
      this.maincontent = this.$refs.myQuillEditor.quill.getText()
      this.textLangs[0].content = this.$refs.myQuillEditor.quill.getText()
    },
    headVideoUrl (newval) {
      if (this.headVideoUrl) {
        this.initHeadVedio()
      } else {
        this.quitHeadVedio()
      }
    }
  },
  async mounted() {
    // 获取公司列表作为二级标题
    /* const params = {
      pageNumber: 1,
      pageSize: 1000,
      // channelId: 'ea43393fdec54c6d92cd55a843cf05f5',
      channelId: this.formPreview.channel // 12月4日修改
    }
    const { data } = await getChannelCompany(params)
    this.companies = data.list */
    const _this = this
    this.$refs.myQuillEditor.quill.on('selection-change', function(range, oldRange, source) {
      if (range) {
        console.log(_this.$refs.myQuillEditor.quill.getText(range.index, range.length))
      }
    })
    // 监听视频播放，以便插入自定义视频
    const headVideoRef = this.$refs.headVideo
		const previewVideoRef = this.$refs.previewVideo
		const insertVideoRef = this.$refs.insertVideo
    headVideoRef.onended = () => {
			headVideoRef.style.display = 'none'
			previewVideoRef.style.display = 'block'
      this.showSecondTitle = true
			this.showChangeLang = true
			previewVideoRef.play()
		}
		previewVideoRef.addEventListener('timeupdate', this.playLoadVideo)
    previewVideoRef.onended = () => { // 原视频播放结束，在此追加监听事件，已被下次查看
      previewVideoRef.muted = true
      previewVideoRef.addEventListener('timeupdate', this.playLoadVideo)
      this.initHeadVedio()
    }
    insertVideoRef.onended = this.continueUserVideo
  },
  methods: {
    initHeadVedio () {
      if (this.headVideoUrl) {
        const headVideo = this.$refs.headVideo
        const previewVideo = this.$refs.previewVideo
        const insertVideo = this.$refs.insertVideo
        headVideo.style.display = 'block' // 展示片头视频
        previewVideo.style.display = 'none' // 影藏原视频
        insertVideo.style.display = 'none' // 影藏插入视频
        this.showSecondTitle = false
        // this.showSynopsis = false
        this.showChangeLang = false
      }
    },
    quitHeadVedio () {
      const headVideo = this.$refs.headVideo
      const previewVideo = this.$refs.previewVideo
      const insertVideo = this.$refs.insertVideo
      headVideo.style.display = 'none' // 展示片头视频
      previewVideo.style.display = 'block' // 影藏原视频
      insertVideo.style.display = 'none' // 影藏插入视频
      this.showSecondTitle = true
      // this.showSynopsis = false
      this.showChangeLang = true
    },
    handleImgToBase64(url, filename, cb) {
      let image = new Image()
      image.crossOrigin = ""
      image.src = url
      image.onload = function () {
        let base64 = imageToBase64(image); //图片转base64
        let file = base64ToFile(base64, filename); //base64转File
        // 根据自身需求调整【因个人项目逻辑不一样，这里使用回调函数】
        cb && typeof cb === 'function' && cb(file)
        return file
      }
    },
    // 栏目切换时删除之前选择的company
    async onSelectChange (channelname, channelId) {
      this.choosedCompany = ''
      this.imgFileData = ''
      if (this.userInfo.company) {
        this.choosedCompany = this.userInfo.company
        let imgurl = require('@/assets/image/'+this.userInfo.company+'.png')
        let filename = this.userInfo.company+'.png'
        this.imgFileData = this.handleImgToBase64(imgurl, filename, (res) => {
          this.imgFileData = res
          // console.log('imgFileData', this.imgFileData)
        })
      }
      this.formPreview.channel = channelId
      this.choosedChannel = channelname
      // console.log('channelname', channelname)
      if (channelname === '虚拟电视频道' || channelname === '品牌宣传') {
        // 获取公司列表作为二级标题
        const params = {
          pageNumber: 1,
          pageSize: 1000,
          // channelId: 'ea43393fdec54c6d92cd55a843cf05f5',
          channelId // 12月4日修改
        }
        const { data } = await getChannelCompany(params)
        this.companies = data.list
      }
    },
    moment, // 自定义事件要用的属性
    onInsertPos () { // 时间插入选择自定义时，显示时间选择框
      if(this.insertPos === '自定义') this.showInsertDiy = true
      else {
        this.showInsertDiy = false
        this.insertSeconds = ''
      }
    },
    // 控制插入时间
    onInsertTime (time, timeString) {
      // console.log('插入时间timestring', timeString)
      this.insertPos = timeString
      const timeArray = timeString.split(":")
      this.insertSeconds = timeArray[0] * 60 + timeArray[1] * 1
    },
    // 虚拟电视频道选择公司
    handleChange (value) {
      this.choosedCompany = value
      let imgurl = require('@/assets/image/'+value+'.png')
      let filename = value+'.png'
      // let imgurl = 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg9.3lian.com%2Fc1%2Fvec2014%2F35%2F31.jpg'
      // this.insertlogoUrl = require('@/assets/image/' + this.choosedCompany + '.png')
      this.imgFileData = this.handleImgToBase64(imgurl, filename, (res) => {
          this.imgFileData = res
          // console.log('imgFileData', this.imgFileData)
        })
    },
    // plus接收子组件传来的语言
    getSelectedLangs (value, chinese) {
      this.selectedLangs = value.slice(0, 3)
      this.editor = ''
      this.maincontent = ''
      if (this.textLangs.length >= 1) this.textLangs[0].content = ''
      this.textLangs = []
      // 筛选出需要输入的语言
      let hasChinese = false
      this.selectedLangs.forEach(item => {
        if(chinese.indexOf(item) > -1) hasChinese = true
        else {
          const tempObj = {lang: item, content: ''}
          this.textLangs.push(tempObj)
        }
      })
      if(hasChinese) {
        const tempObj = {lang: '中文', content: ''}
        this.textLangs.unshift(tempObj)
      }
      // console.log('selectedlangs', this.selectedLangs)
      // console.log('textLangs', this.textLangs)
    },
    // plus中间插播视频播放
    playLoadVideo () {
      const previewVideoRef = this.$refs.previewVideo
      const insertVideoRef = this.$refs.insertVideo

      if (this.inSertUrl) {
        if (this.insertSeconds && (previewVideoRef.currentTime > this.insertSeconds)) {
          previewVideoRef.pause() // 原视频暂停
          previewVideoRef.style.display = 'none' // 影藏原视频
          insertVideoRef.style.display = 'block' // 展示插播的视频
          setTimeout(() => {
            insertVideoRef.play() // 播放插播的视频
          }, 200)
        } else if (((previewVideoRef.currentTime > previewVideoRef.duration / 2) && this.insertPos === '中间') || ((previewVideoRef.currentTime > 0.01) && this.insertPos === '开始') || ((previewVideoRef.currentTime > previewVideoRef.duration - 0.2) && this.insertPos === '结尾')) {
          previewVideoRef.pause() // 原视频暂停
          previewVideoRef.muted = false
          previewVideoRef.style.display = 'none' // 影藏原视频
          insertVideoRef.style.display = 'block' // 展示插播的视频
          setTimeout(() => {
            insertVideoRef.play() // 播放插播的视频
          }, 200)
        }
      }
    },
    // 插播视频结束，继续播放原视频
    continueUserVideo () {
      const previewVideoRef = this.$refs.previewVideo
      const insertVideoRef = this.$refs.insertVideo

      insertVideoRef.style.display = 'none' // 移除插播的视频
      previewVideoRef.style.display = 'block' // 展示原视频
      previewVideoRef.removeEventListener('timeupdate', this.playLoadVideo) // 移除原视频的监听播放插播视频事件
      previewVideoRef.play() // 原视频继续播放
      this.showChangeLang = true
      this.showSecondTitle = true
      // this.showSynopsis = true
    },
    beforeUpload(file) {
      const isTxt = file.type === 'text/plain'
      const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      const isDoc = file.type === 'application/msword'
      if (!isTxt && !isDocx && !isDoc) {
        this.$message.error('导入文件格式不正确');
      }
      const _this = this
      this.importTextFile = file
      let reader = new FileReader()
      if (isTxt) {
        reader.onloadend  = function() {
          _this.$refs.myQuillEditor.quill.setText(this.result)
        }
        reader.readAsText(file)
        return false
      } else if (isDocx) {
        reader.onloadend  = function() {
          let arrayBuffer = reader.result
          mammoth.extractRawText({arrayBuffer: arrayBuffer}).then(function (resultObject) {
            _this.$refs.myQuillEditor.quill.setText(resultObject.value)
          })
        }
        reader.readAsArrayBuffer(file)
        return false
      } else if (isDoc) {
        this.uploadDocFile = file
      }
    },
    handParseDoc() {
      const formData = new FormData()
      formData.append('file', this.uploadDocFile)
      parseDoc(formData).then(res => {
        if (res.message && res.message.code === 0) {
          this.$refs.myQuillEditor.quill.setText(res.data)
        }
      })
    },
    onEditorChange(e) {
      e.quill.deleteText(2000, 4);
      if(this.editor === ''){
        this.TiLength = 0
      }else{
        this.TiLength = e.quill.getLength() - 1
      }
      const getSelection = this.$refs.myQuillEditor.quill.getSelection()
      if (getSelection) {
        this.rangeIndex = getSelection.index
      }
    },
    // 设置编辑器光标位置
    setSelectionFront() {
      this.$refs.myQuillEditor.quill.setSelection(0)
    },
    setSelectionEnd() {
      this.$refs.myQuillEditor.quill.setSelection(this.$refs.myQuillEditor.quill.getLength(), 0)
    },
    onFocus() {
      // let value = this.$refs.myQuillEditor.quill.root.innerText
      // this.subStrEditor(value)
    },
    stopAudio() {
      this.audioObj.pause()
      this.audioObj = null
      this.audioPlay = 0
      this.audioSrc = null
      this.audioSrcArr = []
      this.audioFlag = false
    },
    handleCoverNumberChange(e) {
      const coverNumber = e.target.value
      if (this.coverFileList.length > coverNumber && coverNumber !== 0) {
        this.coverFileList = []
      }
    },
    handleCoverRemove(file) {
      const index = this.coverFileList.indexOf(file)
      const newFileList = this.coverFileList.slice()
      newFileList.splice(index, 1)
      this.coverFileList = newFileList
    },
    beforeCoverUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('仅支持JPEG、PNG格式图片上传');
      }
      if (this.coverFileList.length + 1 > this.formPreview.coverNumber) {
        this.$message.warn(`最多上传${this.formPreview.coverNumber}张图片`)
      } else {
        this.coverFileList = [...this.coverFileList, file]
      }
      return false
    },
    // 插入标签
    insertTag(txt) {
      this.$refs.myQuillEditor.quill.focus()
      let insertPlaceIndex = this.$refs.myQuillEditor.quill.getSelection().index
      this.$refs.myQuillEditor.quill.insertText(insertPlaceIndex, " ", 'tag', '')
      insertPlaceIndex = this.$refs.myQuillEditor.quill.getSelection().index
      this.$refs.myQuillEditor.quill.insertText(insertPlaceIndex, txt, 'tag', 'quill-tag')
      insertPlaceIndex = this.$refs.myQuillEditor.quill.getSelection().index
      this.$refs.myQuillEditor.quill.insertText(insertPlaceIndex, " ", 'tag', '')
    },
    showSubmit() {
      const reg = /\n/g
      if (this.selectedLangs.length) {
        if (this.textLangs.length === 1) { // 只有一种配音文本
          const text = this.$refs.myQuillEditor.quill.getText().replace(reg, '')
          if (text.trim() === '') {
            this.$message.warn('请输入需要配音的文本！')
            return false
          }
        } else { // 有多种配音文本
          const allHasContent = this.textLangs.every(item => { // 是否每种语言都有文本
            return item.content.replace(reg, '').trim()
          })
          if (!allHasContent) {
            this.$message.warn('有语种未输入配音文本!!！')
            return false
          }
        }
      } else {
        this.$message.warn('请选择配音语言！')
        return false
      }
      this.submitVisible = true
    },
    changeMusic() {
      this.$refs.musicModal.open()
    },
    changeAnchor() {
      this.$refs.anchorModal.open(this.anchorSetting)
    },
    cancelToPreview() {
      this.submitVisible = false
      this.makeVideoloading = false
    },
    saveToPreview() {
      this.makeVideoloading = true
      // 改变语言顺序，主语言用原来的代码最最后一次请求
      this.changOrderLangs.push(...this.selectedLangs)
      const tempLang = this.changOrderLangs.shift()
      this.changOrderLangs.push(tempLang)
      // console.log('changOrderLangs', this.changOrderLangs)

      for (let i = 0; i < this.selectedLangs.length; i++) { // 初始化taskid，请求成功用i赋值，如果直接push，可能会错位
        this.$set(this.taskIds, i, '')
      }

      if (this.selectedLangs.length > 1) { // 初始化次语言数组列表
        for (let i = 0; i < this.selectedLangs.length - 1; i++) {
          this.$set(this.videoUrls, i, '')
        }
      }

      for (let i = 0; i < this.selectedLangs.length; i++) {
          this.$refs.ruleProjectForm.validate(valid => {
            if (valid) {
              const reg = /\n/g
              let text = ''
              let content = ''
              // const text = '【' + this.changOrderLangs[i] + '】' + this.$refs.myQuillEditor.quill.getText().replace(reg, '').replace(reg1, '[p0]').replace(reg2, '[p500]').replace(reg3, '[p1000]').replace(reg4, '[p2000]')
              if (this.chineseLangs.indexOf(this.changOrderLangs[i]) > -1) {
                text = '【' + this.changOrderLangs[i] + '】' + this.$refs.myQuillEditor.quill.getText().replace(reg, '').trim().replace(reg1, '[p0]').replace(reg2, '[p500]').replace(reg3, '[p1000]').replace(reg4, '[p2000]')
                content = this.$refs.myQuillEditor.quill.getContents()
                // this.maincontent = this.$refs.myQuillEditor.quill.getText()
                if (i === this.selectedLangs.length - 1) this.pretext = this.$refs.myQuillEditor.quill.getText() // 确定默认显示的文本
              } else {
                this.textLangs.forEach(item => { // 如果不是主语言，则在textlangs中寻找对应的文本
                  if(item.lang === this.changOrderLangs[i]) {
                    // console.log('次语言的itemlang', item.lang)
                    // console.log('changOrderLangs[i]', this.changOrderLangs[i])
                    text = '【' + this.changOrderLangs[i] + '】' + item.content.replace(reg, '').trim().replace(reg1, '[p0]').replace(reg2, '[p500]').replace(reg3, '[p1000]').replace(reg4, '[p2000]')
                    // content = item.content
                    if ( i === this.selectedLangs.length - 1) this.pretext = item.content // 确定默认显示的文本
                  }
                  return
                })
              }
              // let content = this.$refs.myQuillEditor.quill.getContents()
              // console.log('text', text)
              // console.log('content', content)
              const formData = new FormData()
              this.form.videoContent = content
              formData.append('text', text)
              formData.append('spd', this.form.speed)
              formData.append('vol', this.form.volume)
              formData.append('subtitles', this.setting.subtitles) // 字幕
              if (this.anchorSetting) {
                formData.append('anchorId', this.anchorSetting.activeAnchor)
                formData.append('location', this.anchorSetting.position)
                if (this.anchorSetting.curSelectBg) {
                  const bgUrl = process.env.VUE_APP_ZB_DOMAIN_FILE + this.anchorSetting.curSelectBg.split('/webfile')[1]
                  formData.append('bgUrl', bgUrl)
                  if (this.anchorSetting.curSelectBg.indexOf('.mp4') !== -1) {
                    formData.append('bgType', 1)
                  }
                } else {
                  const bgUrl = process.env.VUE_APP_ZB_DOMAIN_FILE + '/bgcover/bg_default.png'
                  formData.append('bgUrl', bgUrl)
                }
                formData.append('width', String(this.anchorSetting.curBgSize.w))
                formData.append('height', String(this.anchorSetting.curBgSize.h))
              }
              add(formData).then( res => {
                if (res.message && res.message.code === 0) {
                  if (!res.data.data || !res.data.data.taskId) {
                    this.$message.error('配音文本缺少语种标签')
                    this.makeVideoloading = false
                    return false
                  }
                  // 二期修改_start
                  /* if (!this.selectedLangs.length || !res.data.data.taskId) {
                    this.$message.error('配音文本缺少语种标签')
                    this.makeVideoloading = false
                    return false
                  } */
                  // 二期修改_end
                  this.taskIds[i] = res.data.data.taskId
                  // console.log('tastids', this.taskIds)

                  // 请求taskid的播放地址
                  if (i !== (this.selectedLangs.length - 1)) {
                    // console.log('this.selectedLangs.length - 1', i)
                    this.getPlusLangUrl(i)
                  } else {
                    // console.log('次语言的i', i)
                    this._getTaskResult(i)
                    this._getAllChannel()
                    // this.$refs.myPreiviewQuillEditor.quill.setContents(content)
                  }
                  // 二期修改_start
                  /* for (let i = 0; i < this.selectedLangs.length; i++) {
                    this.$refs.myPreiviewQuillEditor.quill.setContents(this.selectedLangs[i] + content)
                  } */
                  // 二期修改_end
                } else {
                  this.makeVideoloading = false
                }
              })
            } else {
              this.makeVideoloading = false
            }
          })
        }
    },
    toSetting() {
      this.mode = 2
      this.$refs.setting.doInitForm()
    },
    //  子组件调用-作品设置
    settingBack(data) {
      this.mode = 1
      if (data) {
        this.setting = data
        // console.log('this.setting', this.setting)
      }
    },
    //  子组件调用-主播形象
    anchorBack(data) {
      this.mode = 1
      if (data) {
        this.anchorSetting = data
      }
    },
    handleAudio() {
      this.calcedText = []
      const reg = /\n/g
      let text = ''
      if (this.chineseLangs.indexOf(this.testLang) > -1) {
        text = this.$refs.myQuillEditor.quill.getText().replace(reg, '').trim()
      } else {
        this.textLangs.forEach(item => { // 如果不是主语言，则在textlangs中寻找对应的文本
          if(item.lang === this.testLang) text = item.content.replace(reg, '').trim()
          return
        })
      }
      // console.log('配音文本', text)
      if (!text) {
        this.$message.warn('配音文本不能为空！')
        return false
      }
      this.calcedText = calcText('【' + this.testLang + '】' + text)
      if (this.calcedText.length === 0) {
        this.$message.warn('配音文本格式不正确！')
        return false
      }
      this.calcedText.forEach((el, index) => {
        this._getAudio(el.content.slice(0,450), el.key, index)
      })
    },
    //  查询音频
    _getAudio(text, lang, i) {
      this.loadingAudio = true
      const formData = new FormData()
      formData.append('spd', this.form.speed)
      formData.append('text', text)
      formData.append('language', lang)
      // formData.append('subtitles', 1)
      if (this.anchorSetting && this.anchorSetting.activeAnchor) formData.append('anchorId', this.anchorSetting.activeAnchor) // 语音主播
      getAudio(formData).then(res => {
        if (res.message && res.message.code === 0) {
          if (res.data && res.data.code === '000003') {
            this.$message.error('大于500字', res.data.msg)
            this.loadingAudio = false
            this.audioFlag = false
            return false
          }
          this.audioSrcArr[i] = res.data.data.url
          if (this.audioSrcArr.length === this.calcedText.length && this.audioSrcArr.every(el => el !== undefined) && !this.audioFlag) {
            this.audioFlag = true
            let flag = 0
            this.loadingAudio = false
            this.audioPlay = 1
            this.audioObj = new Audio()
            this.audioObj.loop = false
            this.audioObj.src = this.audioSrcArr[flag]
            this.audioObj.play()
            this.audioObj.addEventListener('ended', () => {
              flag++
              if (flag < this.audioSrcArr.length) {
                this.audioObj.src = this.audioSrcArr[flag]
                this.audioObj.play()
              } else {
                this.audioPlay = 0
                this.audioFlag = false
              }
            })
          }
        } else {
          this.loadingAudio = false
          this.audioFlag = false
        }
      })
    },
    // 次语种查询播放链接
    getPlusLangUrl (i) {
      const formData = new FormData()
      formData.append('taskId', this.taskIds[i])
      getTaskResult(formData).then(res => {
        if (res.message && res.message.code === 0 && res.data && res.data.data && res.data.data.url) {
          const tempObj = {language: this.changOrderLangs[i], videoUrl: res.data.data.url}
          this.videoUrls[i] = tempObj
          // console.log('videourls次语言生成' + i, this.videoUrls)
          if (this.previewVideo && this.videoUrls.every(item => (item && item.videoUrl))) {
            this.makeVideoloading = false
            this.submitVisible = false
            this.mode = 3
            this.$message.success('视频制作成功！')
          }
          return
        } else {
          setTimeout(() => {
            this.getPlusLangUrl(i)
          }, 1000)
        }
        return
      })
    },
    //  查询预览视频
    _getTaskResult(i) {
      const formData = new FormData()
      formData.append('taskId', this.taskIds[i])
      // formData.append('subtitles', 1)
      getTaskResult(formData).then(res => {
        // console.log('res',res)
        if (res.message && res.message.code === 0) {
          if (!res.data || !res.data.data || !res.data.data.url) {
            this.timer = setTimeout(()=> {
              if (this.makeVideoloading) {
                this._getTaskResult(i)
              }
            }, 1000)
          } else {
            this.previewVideo = res.data.data.url
            // console.log('主语言链接生成', this.previewVideo)
            if (this.selectedLangs === 1) {
              this.makeVideoloading = false
              this.submitVisible = false
              this.mode = 3
              this.$message.success('视频制作成功！')
            } else if (this.videoUrls.every(item => (item && item.videoUrl))) {
              this.makeVideoloading = false
              this.submitVisible = false
              this.mode = 3
              this.$message.success('视频制作成功！')
            }
          }
        } else {
          this.submitVisible = false
          this.makeVideoloading = false
        }
      })
    },
    //  查询所有栏目列表
    _getAllChannel() {
      getAllChannel().then(res => {
        if (res.message && res.message.code === 0) {
          this.channelOptions = res.data
        }
      })
    },
    //  发布作品
    _sendProduct() {
      // 获取所有语种的videoUrl
      /* if (this.taskIds.length) {
        for (let i = 0; i < this.taskIds.length; i++) {
          const formData = new FormData()
          formData.append('taskId', this.taskIds[i])
          getTaskResult(formData).then(res => {
            console.log('allVideos', res.data)
            this.allVideoUrl.push(res.data.data.url)
            console.log('allVideoUrl', this.allVideoUrl)
          })
        }
      } */
      // console.log('videoUrls次语言', this.videoUrls)
      this.sendProductloading = true
      this.$refs.rulePreviewForm.validate(valid => {
        if (valid) {
          // console.log('开始上传')
          /* const insertvideourl = ''
          if (this.inSertUrl) {
            const videoObj = this.$refs.insertFile.files[0]
            const formData = new FormData()
            formData.append('file', videoObj)
            formData.append('type', 1)
            upload (formData).then(res => {
              console.log('onInsert', res)
              insertvideourl = res.data
            })
          } */
          //  判断封面文件是否按规定上传
          if (this.coverFileList.length !== this.formPreview.coverNumber) {
            this.$message.warn(`请上传${this.formPreview.coverNumber}张封面图片`)
            this.sendProductloading = false
            return false
          }
          const reg = /\n/g
          const formData = new FormData()

          // if (this.videoUrls.length) {
          //   this.videoUrls.forEach (el => {
          //     formData.append('videoUrls', JSON.stringify(el))
          //   })
          // }
           if (this.videoUrls.length) {
            formData.append('videoUrls', JSON.stringify(this.videoUrls))
          }

          formData.append('title', this.formPreview.title)
          // console.log('title')

          let allContent = this.maincontent
          if (this.textLangs.length > 1) {
            for (let i = 1; i < this.textLangs.length; i++) {
              allContent = allContent + '*@*' + this.textLangs[i].content
            }
          }
          formData.append('content', allContent)
          // console.log('content')

          // if (this.$refs.insertLogo.files[0]) formData.append('logoFile', this.$refs.insertLogo.files[0])

          /* formData.append('voiceContent', this.form.videoContent)
          console.log('voiceContent') */

          formData.append('channelId', this.formPreview.channel)
          // console.log('channelId')

          formData.append('type', this.formPreview.type ? 1 : 2)
          // console.log('type')

          formData.append('videoUrl', this.previewVideo)
          // console.log('videoUrl')

          formData.append('adTime', this.insertPos) // 插入位置
          // console.log('adTime')
          const addUrls = { headVideo: this.headPlayUrl, insertVideo: this.insertPlayUrl}
          formData.append('adUrl', JSON.stringify(addUrls)) // 插入的视频
          // console.log('adUrl')

          formData.append('secondTitle', this.secondTitle + "-" + this.selectedLangs[0] + "-" + this.choosedCompany) // 二级标题、主语言、公司
          // console.log('secondTitle')

          if (this.productDes) formData.append('synopsis', this.productDes) // 视频简介
          // console.log('synopsis')

          if (this.formPreview.source) { // 来源
            formData.append('source', this.formPreview.source)
          }
          // console.log('source')

          this.coverFileList.forEach(el => { // 封面
            console.log('el', el)
            formData.append('coverFiles', el)
          })

          // if (this.haslogo) formData.append('coverFiles', this.$refs.insertLogo.files[0]) // logo
          if (this.imgFileData) formData.append('coverFiles', this.imgFileData)
          // console.log('logoFile')

          if (this.choosedCompany) formData.append('company', this.choosedCompany) // 公司名称

          // console.log('马上开始出发请求')
          sendProduct(formData).then(res => {
            if (res.message && res.message.code === 0) {
              this.$message.success('作品发布成功')
              this.sendProductloading = false
              this.$router.push('/')
            }
          })
        } else {
          this.sendProductloading = false
        }
      })
    },
    // 点击选择语言遮罩，显示select框
    onMask () {
      this.$refs.langMask.style.visibility = 'hidden'
      this.$refs.langSelect.click()
      // console.log(this.$refs.langSelect)
    },
    // 切换语言
    onSwitch (index) {
      /* console.log('onswitch', this.switchedIndex)
      const formData = new FormData()
      formData.append('taskId', this.taskIds[this.switchedIndex])
      getTaskResult(formData).then(res => {
        this.switchedLangUrl = res.data.data.url
        console.log('switchedLangUrl', this.switchedLangUrl)
        this.$refs.previewVideo.src = this.switchedLangUrl
        this.$refs.previewVideo.load()
      }) */
      this.switchedIndex = index
      if (this.switchedIndex === 0) { // 主语言
        this.$refs.previewVideo.src = this.previewVideo
        this.$refs.previewVideo.load()
      } else { // 次语言
        this.$refs.previewVideo.src = this.videoUrls[this.switchedIndex - 1].videoUrl
        this.$refs.previewVideo.load()
      }
      // 切换文本
      if (this.chineseLangs.indexOf(this.selectedLangs[this.switchedIndex]) > -1) this.pretext = this.maincontent // 如果切换的语言是属于中文，则是主语言文本
      else {
        this.textLangs.forEach(item => {
          if(item.lang === this.selectedLangs[this.switchedIndex]) this.pretext = item.content // 如果不是中文，且不是主语言，则在语言文本中寻找对应文本
        })
      }
    },
    // 取消插入片头
    cancelHead () {
      this.$refs.headFile.value = ''
      this.headVideoUrl = ''
      this.headloading = false
    },
    // 取消插入视频
    cancelInsert () {
      this.$refs.insertFile.value = ''
      this.inSertUrl = ''
      this.insertSeconds = ''
      this.insertPos = ''
      this.showInsertDiy = false
      this.insertloading = false
    },
    // 取消插入logo
    cancelLogo () {
      this.$refs.insertLogo.value = ''
      this.insertlogoUrl = ''
      this.haslogo = false
    },
    // 插入片头
    onHead () {
      this.headloading = true
      const headObj = this.$refs.headFile.files[0]
      this.headVideoUrl = window.URL.createObjectURL(headObj)
      const formData = new FormData()
      formData.append('file', headObj)
      formData.append('type', 1)
      upload (formData).then(res => {
        // console.log('insertPlayUrl', this.insertPlayUrl)
        if (res.message && res.message.code === 0) {
              this.headPlayUrl = res.data
              this.$message.success('视频片头成功')
              this.headloading = false
        }
      })
    },
    // 插入视频
    onInsert () {
      this.insertloading = true
      const videoObj = this.$refs.insertFile.files[0]
      this.inSertUrl = window.URL.createObjectURL(videoObj)
      const formData = new FormData()
      formData.append('file', videoObj)
      formData.append('type', 1)
      upload (formData).then(res => {
        this.insertPlayUrl = res.data
        // console.log('insertPlayUrl', this.insertPlayUrl)
        if (res.message && res.message.code === 0) {
              this.$message.success('视频插入成功')
              this.insertloading = false
        }
      })
    },
    // 插入logo
    onInsertLogo () {
      const logoObj = this.$refs.insertLogo.files[0]
      this.insertlogoUrl = window.URL.createObjectURL(logoObj)
      this.haslogo = true
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.timer) {
      this.timer = ''
      clearTimeout(this.timer)
    }
    next()
  }
}
</script>

<style lang="less">
.works-make {
  h1 {
    font-size: 20px;
    color: #333333;
    line-height: 30px;
    text-align: left;
    padding: 34px 0;
  }
  .work-navs {
    display: flex;
    align-items: center;
    background: #fff;
    padding: 22px 30px;
    // plus0_语言选择
    .plus0_langchoose {
      width: 400px;
      margin-right: 12px;
      border-radius: 15px;
    }
    .nav-item {
      margin-right: 12px;
    }
    .nav-tip {
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #999999;
    }
  }
  .work-body {
    display: flex;
    background: #FFFFFF;
    margin-top: 10px;
    // plus1_语言文字输入
    .plus1_text {
      max-height: 1200px;
      position: relative;
      display: flex;
      flex-direction: column;
      // plus1_0_主语言placeholder
      .plus1_mainholder {
        font-size: 14px;
        color: #757575;
        background-color: #fff;
        position: absolute;
        z-index: 2;
        top: 40px;
        left: 78px;
      }
      .work-body-editor {
        border-bottom: 1px solid #ccc;
        width: 640px;
        height: 450px;
        padding: 28px 30px;
        // plus1_2次语言的文字
        .plus1_2_otherlang {
          height: 100%;
          font-size: 13px;
          resize: none;
          border: none;
          outline: none;
        }
        .editor {
          height: calc(100% - 24px);
        }
        .editor-footer {
          height: 24px;
          color: #999999;
          font-size: 14px;
          text-align: right;
          .footer-box {
            height: 100%;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            .arrow-item {
              height: 100%;
              display: flex;
              align-items: center;
              padding: 0 8px;
              background: #EDEDED;
              border: 1px solid #EDEDED;
              cursor: pointer;
            }
            .arrow-item:hover {
              color: #E4373A;
              border: 1px solid #E4373A;
              background: #ffffff;
            }
          }
        }
      }
    }
    .work-body-config {
      flex: 1;
      background: #F7F5F6;
      box-shadow: 0px 2px 5px 0px rgb(0 0 0 5%);
      padding: 45px 21px;
      text-align: left;
      h2 {
        font-weight: 600;
        font-size: 16px;
        margin-bottom: 40px;
      }
      .config-form {
        display: flex;
        flex-direction: column;
        .ant-form-item {
          display: flex;
          align-items: center;
        }
        .insert-pause {
          display: flex;
          justify-content: space-between;
          height: 22px;
          align-items: center;
          .item {
            display: flex;
            align-items: center;
            height: 100%;
            background: #EDEDED;
            padding: 0 10px;
            cursor: pointer;
          }
          .item:hover {
            background-color: #fc938d;
            color: #ffffff;
          }
        }
        .anchor-config {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .anchor-config-left {
            display: flex;
            align-items: center;
            img {
              width: 48px;
              height: 48px;
              border-radius: 24px;
            }
          }
        }
      }
      .form-btn {
        margin-top: 50px;
        margin-left: 50px;
        text-align: center;
        display: flex;
        button {
          margin: 0 10px;
        }
      }
    }
  }
  .works-preview-box {
    .preview-title {
      display: flex;
      align-items: center;
      background: #fff;
      padding: 22px 30px 10px 30px;
      .ant-form-item {
        width: 640px;
      }
    }
    .preview-body {
      display: flex;
      background: #FFFFFF;
      margin-top: 10px;
      .preview-left {
        width: 640px;
        padding: 30px;
        // plus_作品预览内容调整
        .plus_precontent_wrap {
          display: flex;
          justify-content: space-between;
          .plus_precontent {
            resize: none;
            border: 1px solid #d9d9d9;
            outline: none;
            font-size: 14px;
            padding: 8px;
            margin-bottom: 10px;
          }
        }
        // plus_视频/频道显示/简介
        .plus_video_channel_des {
          margin-left: -15px;
          position: relative;
          // plus_左上角logo及公司名称
          .plus_logo_company {
            position: absolute;
            top: 20px;
            left: 25px;
            // plus_左上角logo
            .plus_lefttop_logo {
              height: 24px;
              display: flex;
              flex-direction: column;
              align-items: center;
              img {
                max-width: 100px;
                max-height: 25px;
              }
            }
            // plus_logo下的公司名
            .plus_lefttop_company {
              letter-spacing: 2px;
              text-align: center;
              // padding-top: 2px;
              font-size: 17px;
              font-weight: bold;
              opacity: 0.85;
              color: #fff;
            }
          }
          // plus_底部视频简介
          .plus_des_wrap {
            color: #fff;
            width: 530px;
            position: absolute;
            bottom: 66px;
            left: 35px;
            .plus_des_main {
              padding-left: 5px;
              font-size: 19px;
              font-weight: bold;
              text-align: left;
              height: 30px;
              line-height: 30px;
              background-image: linear-gradient(to right, rgba(230,100,26,1), rgba(230,100,26,0))
            }
            .plus_des_detail {
              padding-left: 5px;
              font-size: 14px;
              text-align: left;
              height: 24px;
              line-height: 24px;
              background-image: linear-gradient(to right, rgba(66,27,4,1), rgba(66,27,4,0))
            }
          }
          // plus_语言切换
          .plus_langChoose {
            outline: none;
            position: absolute;
            top: 10px;
            left: 518px;
            .plus_langChooseItem {
              color: #fff;
              padding: 1px 5px 6px;
              border-radius: 5px;
              background-color: rgba(0,0,0,0.5);
              .plus_langChooseItem_item {
                margin-top: 2px;
                font-size: 14px;
                opacity: 0.6;
                cursor: pointer;
              }
              .plus_langChooseItem_active {
                color: coral;
              }
            }
            select {
              opacity: 0.5;
              outline: none;
              border-radius: 5px;
              font-size: 12px;
            }
          }
        }
        .editor {
          height: 94px;
          border: 1px solid #E6E6E6;
          border-radius: 2px;
        }
      }
      .preview-right {
        background: #F7F5F6;
        flex: 1;
        padding: 30px 20px;
        // plus_频道选择
        .plus_channelwrap {
          width: 220px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        h2 {
          font-size: 16px;
          text-align: left;
          margin-bottom: 20px;
        }
        .extra-tips {
          color: #999999;
          font-size: 12px;
          text-align: left;
        }
        .cover-upload {
          display: inline-block;
          width: 100%;
          text-align: left;
          .cover-upload-body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 160px;
            height: 90px;
            color: #999999;
            background: #FAFAFA;
            border: 1px solid #E7E7E7;
            border-radius: 4px;
            margin: 10px 0;
            cursor: pointer;
          }
        }
        // plus自定义描述
        .plus_myDes {
          margin-top: 12px;
          text-align: left;
          font-size: 12px;
          display: flex;
          align-items: center;
        }
        // plus视频插入框
        .plus_insertbox {
          margin-top: 15px;
          margin-bottom: 10px;
          display: flex;
          justify-content: flex-start;
          position: relative;
          .plus_insertbox_insertRef { // 文件选择框
            margin-right: 5px;
            max-width: 181px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .plus_insertbox_select { // select选择框
            border: 1px solid transparent;
            outline: none;
            border-radius: 5px;
            box-sizing: border-box;
            transition: 0.2s;
          }
          .plus_insertbox_select:hover {
            background-color: #f3f0eb;
            border: 1px solid rgb(27, 27, 27);
          }
          // plus自定义时间
          .plus_timediy {
            position: absolute;
            top: -39px;
            left: 227px;
          }
        }
        // plus_logo插入框
        .plus_logobox {
          margin-top: 15px;
          margin-bottom: 10px;
          margin-left: 55px;
        }
      }
    }
    .ant-form-item {
      margin-bottom: 12px;
      width: 100%;
    }
    .ant-form-item-control {
      text-align: left;
    }
  }
  .ql-toolbar {
    height: 0;
    padding: 0;
  }
  .ql-snow {
    border: none;
  }
  .ant-input, .ant-select-selection {
    border-radius: 2px;
  }
}
.ant-tooltip-inner {
  background-color: #F2383B;
  font-size: 12px;
}
.ant-slider-rail {
  background-color: #ffffff;
}
.ant-tooltip-arrow::before {
  background-color: #F2383B;
}
.make-modal {
  .title {
    text-align: center;
    margin-bottom: 31px;
  }
  .ant-input {
    border-radius: 2px;
  }
}
.quill-tag {
  color: #e4373a;
  background: #ffbeb8;
  padding: 2px 7px;
}
// plus0_作品语言选择
.plus0_wrap {
    line-height: 1.499;
    position: relative;
    display: inline-block;
    font-weight: 400;
    white-space: nowrap;
    text-align: center;
    background-image: none;
    border: 1px solid transparent;
    box-shadow: 0 2px 0 rgb(0 0 0 / 2%);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    touch-action: manipulation;
    height: 32px;
    padding: 5px 8px 0 22px;
    font-size: 14px;
    border-radius: 16px;
    color: rgba(0, 0, 0, 0.65);
    background-color: #fff;
    border-color: #d9d9d9;
    .plus0_1_choose {
      margin-left: -9px;
    }
    .plus0_1_choose:hover { // 选择语言文字
      transition: 0.5s;
      color: red;
    }
    // plus0_1_语言种类列表
    .plus0_1_list {
      box-sizing: border-box;
      transition: 0.5s;
      height: 0;
      visibility: hidden;
      overflow: auto;
      text-align: left;
      padding: 5px;
      background-color: rgb(63, 63, 63);
      border-radius: 5px;
      color: #fff;
      position: absolute;
      left: -6px;
      top: 30px;
      z-index: 2;
      .plus0_1_list_item {
        margin-top: 5px;
      }
    }
    .plus0_1_choose:hover ~ .plus0_1_list {
      visibility: visible;
      height: 294px;
    }
    .plus0_1_list:hover {
      visibility: visible;
      height: 294px;
    }
}
.plus0_wrap:hover {
  border: 1px solid rgb(252, 76, 76);
}
// plus_语音选择列表
.plus_selectList {
  margin-top: 10px;
  outline: none;
  border: none;
  padding: 2px;
  font-size: 14px;
  border-radius: 5px;
}
</style>