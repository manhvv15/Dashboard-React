{{- define "selectorLabels" -}}
app.name: {{ .Values.name }}
app: {{ .Values.app }}
version: {{ .Values.appVersion | quote }}
app.instance:  {{ .Values.instance }}
{{- end }}

{{- define "labels" -}}
{{ include "selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Values.instance }}
{{- end }}