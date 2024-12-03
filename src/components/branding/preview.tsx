import { useState } from 'react';

import { Dialog, DialogBody, DialogHeader } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import parse from 'html-react-parser';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { getPreviewTemplate } from '@/services/user-management/branding';
import { IPreviewTemplateResponse } from '@/types/user-management/branding';
import SvgIcon from '../commons/SvgIcon';

interface Props {
  isShowModal: boolean;
  onCancel: () => void;
  marketId: string;
  variables: { name: string; value: any }[];
}
export const ModalPreview = ({ isShowModal, onCancel, variables }: Props) => {
  const { t } = useTranslation(LocaleNamespace.Common);
  const [previewContent, setPreviewContent] = useState('');

  const content = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
</head>

<body>
  <div style="display:block;width:100%;text-align:center;">
    <div style="max-width: 600px;margin:0 auto;">
      <table style="font-family:Arial, Helvetica, sans-serif;color:{{workspace_layout_color.layout_header.header_text_color | default: #333}};font-size: 14px;text-align:left;width: 100%;" bgcolor="{{workspace_layout_color.layout_header.header_background_color | default: #fff}}">
        <tr>
          <td style="padding:10px 0 0;text-align:center;">
            <a href="{{workspace_url}}"
              style="text-decoration:none;color:rgb(38,38,38);margin:0px;padding:0px;">
              <img src="{{workspace_logo}}" alt="{{workspace_name}}" width="100">
            </a>
          </td>
        </tr>
        {% if workspace_labels.size > 0 %}
        <tr>
          <td style="padding-top:16px;">
            <table width="100%" style="margin:0 auto;font-size: 12px;text-align:center;">
              <tbody>
                <tr style="margin:0px;padding:0px;">
                  <td width="33%">
					{% assign label_top_left = workspace_labels | where: "label_position", "2" | first %}
					  {% if label_top_left %}
						<a href="{{label_top_left.label_url}}"
						  style="display:inline-block;vertical-align:middle;text-decoration:none;color:{{workspace_layout_color.layout_header.header_text_color | default: rgb(38,38,38)}};">
						  {% case label_top_left.label_type %}
						  {% when "1" %}
							 <img src="https://cdn.janbox.com/images/email/icon-first-time.png?v=1" alt="first-time">
						  {% when "2" %}
							 <img src="https://cdn.janbox.com/images/email/icon-help-center.png?v=1" alt="help-center">
						  {% when "3" %}
							 <img src="https://cdn.janbox.com/images/email/icon-user.png?v=1" alt="user">
						  {% endcase %}
						  <span>{{label_top_left.label_name}}</span>
						</a>
					  {% endif %}
                  </td>
                  <td width="33%">
					{% assign label_top_center = workspace_labels | where: "label_position", "1" | first %}
					  {% if label_top_center %}
						<a href="{{label_top_center.label_url}}"
						  style="display:inline-block;vertical-align:middle;text-decoration:none;color:{{workspace_layout_color.layout_header.header_text_color | default: rgb(38,38,38)}};">
						  {% case label_top_center.label_type %}
						  {% when "1" %}
							 <img src="https://cdn.janbox.com/images/email/icon-first-time.png?v=1" alt="first-time">
						  {% when "2" %}
							 <img src="https://cdn.janbox.com/images/email/icon-help-center.png?v=1" alt="help-center">
						  {% when "3" %}
							 <img src="https://cdn.janbox.com/images/email/icon-user.png?v=1" alt="user">
						  {% endcase %}
						  <span>{{label_top_center.label_name}}</span>
						</a>
					  {% endif %}
                  </td>
                  <td width="33%">
					{% assign label_top_right = workspace_labels | where: "label_position", "3" | first %}
					  {% if label_top_right %}
						<a href="{{label_top_right.label_url}}"
						  style="display:inline-block;vertical-align:middle;text-decoration:none;color:{{workspace_layout_color.layout_header.header_text_color | default: rgb(38,38,38)}};">
						  {% case label_top_right.label_type %}
						  {% when "1" %}
							 <img src="https://cdn.janbox.com/images/email/icon-first-time.png?v=1" alt="">
						  {% when "2" %}
							 <img src="https://cdn.janbox.com/images/email/icon-help-center.png?v=1" alt="">
						  {% when "3" %}
							 <img src="https://cdn.janbox.com/images/email/icon-user.png?v=1" alt="">
						  {% endcase %}
						  <span>{{label_top_right.label_name}}</span>
						</a>
					  {% endif %}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        {% endif %}
 
		<!-- Base content -->
    <tr>
      <td style="padding: 16px 0 0;text-align: center;">
        Some content here
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">
      <button style="background-color: {{workspace_layout_color.layout_button.button_background_color | default: #1D39C4}};color: {{workspace_layout_color.layout_button.button_font_color | default: #fff}};border: none;border-radius: 4px;padding: 8px 16px;margin: 16px 0;text-decoration: none;">
          Button
        </button>
      </td>
    </tr>
		<!-- End base content -->

		{% if workspace_support_name.size > 0 %}
        <tr>
			<td height="8">
			</td>
		</tr>	
         <tr>
          <td style="font-style:italic;color:{{workspace_layout_color.layout_header.header_text_color | default: #999}};padding: 8px 0 0;line-height: 24px;">
            For more information on our policy, please contact us at: <a href="{{workspace_support_link}}"
              style="color: {{branding_layout_color.header.textColor | default: #1D39C4}};text-decoration: underline;">{{workspace_support_name}}</a>
          </td>
        </tr>
		{% endif %}

        <tr>
          <td style="padding-top:8px;">
            <span style="padding-bottom: 8px;display:block;">
              <span style="height:3px;background:#333;display:block;"></span>
            </span>
          </td>
        </tr>

        <tr>
          <td>
            <table style="font-size: 12px;width: 100%;text-align: center;line-height: 22px;">
              {% if workspace_referral_images.size > 0 %}
              <tr>
                <td style="color:{{workspace_layout_color.layout_header.header_text_color | default: #687077}};">Download our mobile app for the best experience</td>
              </tr>
              <tr>
                <td style="padding: 0 0 24px;">
                  <table style="font-size: 12px;width: 100%;text-align: center;margin: 16px 0 0;">
                    <tbody>
                      <tr>
                        {% assign android_image_download = workspace_referral_images | where: "referral_image_type", 0 | first %}
                        {% if android_image_download %}
                          <td><img src="{{android_image_download.referral_image_url}}" width="172" height="63" alt="GooglePlay" /></td>
                        {% endif %}
                        {% assign ios_image_download = workspace_referral_images | where: "referral_image_type", 1 | first %}
                        {% if ios_image_download %}
                          <td><img src="{{ios_image_download.referral_image_url}}" width="172" height="63" alt="AppStore" /></td>
                        {% endif %}
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            {% endif %}
			
			{% assign label_bottom_left = workspace_labels | where: "label_position", "5" | first %}
			{% assign label_bottom_center = workspace_labels | where: "label_position", "4" | first %}
			{% assign label_bottom_right = workspace_labels | where: "label_position", "6" | first %}
			
			{% if workspace_labels.size > 0 and (label_bottom_left or label_bottom_center or label_bottom_right) %}
              <tr>
                <td style="border-top: 1px solid #F2F4F8;border-bottom: 1px solid #F2F4F8;padding: 7px 0;">
                  <table style="font-size: 12px;width: 100%;text-align: center;">
                    <tbody>
                      <tr>
                        {% assign label_bottom_left = workspace_labels | where: "label_position", "5" | first %}
                        {% if label_bottom_left %}
                        <td style="border-right: 1px solid #F2F4F8;">
                          <a href="{{label_bottom_left.label_url}}" style="color: {{workspace_layout_color.layout_header.header_text_color | default: #333}};text-decoration: none;">
                            {% case label_bottom_left.label_type %}
                            {% when "1" %}
                            <img src="https://cdn.janbox.com/images/email/icon-first-time.png?v=1" alt="first-time">
                            {% when "2" %}
                            <img src="https://cdn.janbox.com/images/email/icon-help-center.png?v=1" alt="help-center">
                            {% when "3" %}
                            <img src="https://cdn.janbox.com/images/email/icon-user.png?v=1" alt="user">
                            {% endcase %}
                            <span>{{label_bottom_left.label_name}}</span>
                          </a>
                        </td>
						  {% endif %}
						  
						  {% assign label_bottom_center = workspace_labels | where: "label_position", "4" | first %}
						  {% if label_bottom_center %}
							<td style="border-right: 1px solid #F2F4F8;">
								<a href="{{label_bottom_center.label_url}}" style="color: {{workspace_layout_color.layout_header.header_text_color | default: #333}};text-decoration: none;">
									{% case label_bottom_center.label_type %}
									{% when "1" %}
									 <img src="https://cdn.janbox.com/images/email/icon-first-time.png?v=1" alt="first-time">
									{% when "2" %}
									 <img src="https://cdn.janbox.com/images/email/icon-help-center.png?v=1" alt="help-center">
									{% when "3" %}
									 <img src="https://cdn.janbox.com/images/email/icon-user.png?v=1" alt="user">
									{% endcase %}
								  <span>{{label_bottom_center.label_name}}</span>
								</a>
							</td>
						  {% endif %}
						  
						  {% assign label_bottom_right = workspace_labels | where: "label_position", "6" | first %}
						  {% if label_bottom_right %}
							<td>
								<a href="{{label_bottom_right.label_url}}" style="color: {{workspace_layout_color.layout_header.header_text_color | default: #333}};text-decoration: none;">
									{% case label_bottom_right.label_type %}
									{% when "1" %}
									 <img src="https://cdn.janbox.com/images/email/icon-first-time.png?v=1" alt="first-time">
									{% when "2" %}
									 <img src="https://cdn.janbox.com/images/email/icon-help-center.png?v=1" alt="help-center">
									{% when "3" %}
									 <img src="https://cdn.janbox.com/images/email/icon-user.png?v=1" alt="user">
									{% endcase %}
								  <span>{{label_bottom_right.label_name}}</span>
								</a>
							</td>
						  {% endif %}
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
			  {% endif %}
              
			  {% if workspace_signature and workspace_signature.size > 0 %}
              <tr>
                <td style="color: {{workspace_layout_color.layout_header.header_text_color | default: #687077}};padding:8px 0;">{{workspace_signature}}
                </td>
              </tr>
			  {% endif %}
			  {% if workspace_socials.size > 0 %}
              <tr>
                <td>
                  <table style="margin:0 auto;">
                    <tbody>
                      <tr>
						{% for social in workspace_socials %}
                        <td style="padding:8px 8px;">
                          <a href="{{social.social_url}}"
                            style="display:inline-block;width:32px;height:32px;font-size:0px;text-decoration:none;color:{{workspace_layout_color.layout_header.header_text_color | default: rgb(38,38,38)}};padding:0px;">
                            <img src="{{social.social_logo}}"
								width="32"
								alt="{{social.social_name}}">
                          </a>
                        </td>
						{% endfor %}
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
			  {% endif %}
              <tr>
                <td style="color: #687077;line-height:22px;padding-bottom:16px">
					{% if workspace_address.size > 0 %}
					Contact Address:<br/>
					{{workspace_address}}<br/>
					{% endif %}
                  <span style="color: #121619">Copyright © {{workspace_name}}.</span> All right reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </div>
</body>
</html>`;

  useQuery({
    queryKey: ['getPreviewTemplateBrandingSetting', variables],
    retry: 0,
    enabled: isShowModal,
    cacheTime: 0,
    staleTime: 0,
    queryFn: () => {
      const request = {
        subject: '',
        content: content,
        variables: variables,
      };
      return getPreviewTemplate(request);
    },
    onSuccess(data: AxiosResponse<IPreviewTemplateResponse>) {
      setPreviewContent(data.data.content);
    },
  });

  return (
    <Dialog open={isShowModal} size="md" handler={onCancel}>
      <DialogHeader className="text-lg font-medium leading-6 text-ic-ink-6s flex items-center justify-between">
        <p>{`${t('notification.preview')} `}</p>
        <button onClick={onCancel}>
          <SvgIcon icon="close" width={24} height={24} className="text-ic-ink-6s" />
        </button>
      </DialogHeader>
      <DialogBody className="w-full h-[750px] overflow-scroll scrollbar">
        <div className="flex flex-col items-center justify-center w-full mt-2">
          <div className="w-full mt-2">
            <div className="mx-6 border bg-ic-light flex items-center justify-center rounded-t-xl ">
              {parse(previewContent)}
            </div>
          </div>
        </div>
      </DialogBody>
    </Dialog>
  );
};
