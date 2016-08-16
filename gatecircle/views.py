from django.shortcuts import render_to_response
import pandas as pd


class Station:

    def __init__(self):
        hour_df = pd.read_csv('csv_data/0810_station_gate_ra_cardgubun_user__hour__count', dtype={'ra': object, 'cardgubun': object, 'user': object})
        gate_df = pd.read_csv('csv_data/역_게이트그룹_게이트번호별_승하차인원.csv', encoding='cp949')

        gate_df2 = gate_df.set_index(['역코드', '게이트번호'])[['게이트그룹']]
        gate_df2.columns = ['gate_group']
        hour_df2 = hour_df.join(gate_df2, on=['station', 'gate'], how='left')
        self.hour_df3 = hour_df2[['station', 'gate', 'gate_group', 'ra', 'cardgubun', 'user', '5', '6', '7', '8', '9', '10',
                                  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '0', '1']]
        self.init_df = self.hour_df3.copy()
        self.init_df.rename(columns={'0': '24', '1': '25'}, inplace=True)
        self.init_zero_df = None
        self.result_df = None
        self.target = None
        self.station_code = None
        self.line = None

    def set_station(self, target):
        self.target = target

    # 역 이름, 호선정보 사진파일, 호선, 역코드, 역구내 도면
    def staion_info(self):
        station_df = pd.read_csv('station_info.csv', encoding='cp949')  # target 숫자와 역코드 정보
        pic_df = pd.read_csv('station_pic_file.csv', encoding='cp949')  # 사진파일명, 사진이 여러개여서 분리함

        station_name = station_df[station_df['target'] == int(self.target)]['station_name'].iloc[0]
        line_info = station_df[station_df['target'] == int(self.target)]['line_info'].iloc[0]
        self.line = station_df[station_df['target'] == int(self.target)]['line'].iloc[0]
        self.station_code = station_df[station_df['target'] == int(self.target)]['station_code'].iloc[0]
        pic_list = pic_df[pic_df['code'] == self.station_code]['file_name'].tolist()

        return station_name, line_info, pic_list

    # 게이트그룹 위치 리스트
    def gategroup_locations(self):
        gategroup_df = pd.read_csv('gate_group_locations.csv', encoding='cp949')
        gategroup_df2 = gategroup_df[gategroup_df['station_code'] == int(self.station_code)].iloc[:, 2:]

        if self.line == 1:
            gategroup_df2['left'] -= 150
            gategroup_df2['top'] += 768
        elif self.line == 2:
            gategroup_df2['left'] -= 150
            gategroup_df2['top'] += 740
        elif self.line == 3:
            gategroup_df2['left'] -= 150
            gategroup_df2['top'] += 740
        elif self.line == 4:
            gategroup_df2['left'] -= 150
            gategroup_df2['top'] += 740

        circle_locations = list(gategroup_df2.T.to_dict().values())

        return circle_locations

    # 원 반경 딕셔너리
    def circle_radius_dict(self, df, normalize=True, init=True):
        gate_group_df = df.groupby(['station', 'gate_group']).sum()
        gate_group_df2 = gate_group_df.loc[:, '5':'25']
        gate_group_df3 = gate_group_df2.reset_index()
        gate_group_df4 = gate_group_df3[gate_group_df3['station'] == self.station_code].iloc[:, 1:].set_index('gate_group')

        if gate_group_df4.empty:
            gate_group_df5 = self.init_zero_df
        else:
            group_sum_df = gate_group_df4.sum(axis=1).to_frame()

            if normalize:
                gate_group_df5 = self._adjust_value(gate_group_df4, 80)  # 시간별 최대값을 80으로
                gate_group_df5['4'] = self._adjust_value(group_sum_df, 80)[0]    # 전체시간 합계 최대값을 80으로
            else:
                gate_group_df5 = gate_group_df4
                gate_group_df5['4'] = group_sum_df[0]
                gate_group_df5 = gate_group_df5.fillna(0).applymap(lambda x: int(round(x)))

        radius = gate_group_df5.T.to_dict()

        if init:
            self.init_zero_df = gate_group_df5.set_value(gate_group_df5.index, gate_group_df5.columns, 0)

        return radius

    # 최대값을 80 으로 하기위한 변수
    def _adjust_value(self, df, constance):
        cov = df.max().max() / constance
        norm_df = df.apply(lambda x: x / cov)
        result_df = norm_df.fillna(0).applymap(lambda x: int(round(x)))
        return result_df


#  인스턴스 만들기
station = Station()


def index(request):
    return render_to_response('index.html')


def station_info(request):

    target = request.GET['target']

    station.max_sum, station.max_all = (False, False)
    station.set_station(target)

    # 역 이름, 호선정보 사진파일, 호선, 역코드, 역구내 도면 사진파일
    station_name, line_info, pic_list = station.staion_info()

    # 게이트그룹 위치 리스트
    circle_locations = station.gategroup_locations()

    # 원 반경 딕셔너리
    radius = station.circle_radius_dict(station.init_df, init=True)
    count = station.circle_radius_dict(station.init_df, normalize=False)

    return render_to_response('station_info.html', {
        'target': target,
        'station_name': station_name,
        'line_info': line_info,
        'pic_list': pic_list,
        'circle_locations': circle_locations,
        'radius': radius,
        'count': count
    })


def ajax_circle(request):

    df = station.init_df
    ra = request.GET.get('ra', None)
    cardgubun = request.GET.get('cardgubun', None)
    user = request.GET.get('user', None)

    df_ra = df if ra == 'all' else df[df['ra'] == str(ra)]
    df_ra_cardgubun = df_ra if cardgubun == 'all' else df_ra[df_ra['cardgubun'] == str(cardgubun)]
    df_ra_cardgubun_user = df_ra_cardgubun if user == 'all' else df_ra_cardgubun[df_ra_cardgubun['user'] == str(user)]

    circle_locations = station.gategroup_locations()
    radius = station.circle_radius_dict(df_ra_cardgubun_user)
    count = station.circle_radius_dict(df_ra_cardgubun_user, normalize=False)

    return render_to_response('circle_area.html', {
        'circle_locations': circle_locations,
        'radius': radius,
        'count': count
    })


def ajax_user_by_cardgubun(request):

    cardgubun = request.GET.get('cardgubun', None)

    usr = {'1': '일반', '2': '초등생', '3': '중고생', '4': '청소년', '6': '경로',
           '7': '장애인', '8': '국가유공자', '11': '직원', '12': '어린이(1회권)', '21': '경로(1회권)', '22': '유공(1회권)',
           '23': '장애(1회권)', '24': '동반무임(1회권)', '41': '영어 일반(1회권)', '42': '일어 일반(1회권)',
           '43': '중국어 일반(1회권)', '44': '영어 어린이(1회권)', '45': '일어 어린이(1회권)', '46': '중국어 어린이(1회권)'}

    if cardgubun == 'all':
        user_key_list = ['1', '2', '4', '6', '7', '8', '11', '12', '21', '22', '23', '24', '41', '42', '43', '44', '45', '46',]
        user_value_list = [usr[i] for i in user_key_list]
    else:
        df = station.init_df
        df.loc[:, 'cardgubun'] = df['cardgubun'].apply(lambda x: str(x))
        df2 = df[df['cardgubun'] == str(cardgubun)]
        key_list = list(map(str, df2['user'].unique().tolist()))
        user_key_list = []
        user_value_list = []
        for i in key_list:
            try:
                user_value_list.append(usr[i])
                user_key_list.append(i)
            except KeyError:
                continue

    return render_to_response('user_select_area.html', {
        'user_list': zip(user_key_list, user_value_list)
    })